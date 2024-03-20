import { strict as assert } from 'assert';
import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';

import {
    ParseResult,
    RenderResult,
    TerraContext,
} from '@agoraio-extensions/terra-core';
import OpenAI from 'openai';
import { CXXFile, CXXTYPE, CXXTerraNode, SimpleTypeKind, Struct } from '@agoraio-extensions/cxx-parser';
import { askGPT } from '../utils/gpt_utils';
import { PointerArrayNameMapping, PointerMarkerParserConfigMarker } from '../parsers/pointer_marker_parser';

const prompt = `
You are an AI experienced in parsing and analyzing C++ code. Your task is to identify "pointer field-length field" pairs within a given C++ struct. 
Exclude any pair where the pointer field's name is "buffer" or the pointer field type is "uint8_t *". Additionally, disregard any pointer without a direct length field counterpart. 
Your output should be in JSON format, returning an empty array [] if no valid pairs are found, or [{"ptrName": "pointer_name", "lengthName": "length_field_name"}] for each valid pair found. 
The response MUST contains only the JSON result without any additional explanations.

Given struct:
\`\`\`c++
{{ STRUCT_SOURCE }}
\`\`\`
`;

async function processGPT(parseResult: ParseResult) {
    let structs = parseResult.nodes
        .flatMap((node) => (node as CXXFile).nodes)
        .filter((node) => node.isStruct())
        .filter((node) => {
            return node.asStruct()
                .member_variables
                .find((member) => member.type.kind === SimpleTypeKind.pointer_t) !== undefined;
        });

    let markers: string[] = [];

    for (let st of structs) {
        let struct = st.asStruct();
        let structSource = structToSource(struct);
        let promptWithStruct = prompt
            .replace('{{ STRUCT_NAME }}', struct.name)
            .replace('{{ STRUCT_SOURCE }}', structSource)
            .trim();
        let res = await askGPT(promptWithStruct);
        if (res.length > 0) {
            let jsonArray = Object.values(JSON.parse(res));
            if (jsonArray.length === 0) {
                continue;
            }
            let pointerArrayNameMappings = (jsonArray as PointerArrayNameMapping[]).map((entry: any) => {
                return `
{
    ptrName: "${entry.ptrName}",
    lengthName: "${entry.lengthName}",
}`.trim();
            });

            let marker = `
{
    node: {
        __TYPE: CXXTYPE.Struct,
        name: "${struct.name}",
        namespaces: [${struct.namespaces.map((it) => `"${it}"`).join(',')}],
    },
    pointerArrayNameMappings: [
        ${pointerArrayNameMappings.join(',\n')}
    ],
}`.trim();
            markers.push(marker);
        }
    }
    console.log(markers);

    let output = `
import { CXXTYPE } from "@agoraio-extensions/cxx-parser";

module.exports = {
  markers: [
    ${markers.join(',\n')}
  ],
};
`.trim();

    let configPath = path.resolve(`${__dirname}/../../configs/rtc/pointer_marker.config.ts`);
    fs.writeFileSync(configPath, output);

    // Reformat the file
    execSync(`yarn prettier ${configPath} --write`, {
        cwd: path.resolve(__dirname, '../../'),
    });
}

export function PointerMarkerGPTRenderer(
    terraContext: TerraContext,
    args: any,
    parseResult?: ParseResult
): RenderResult[] {

    processGPT(parseResult!);

    return [];
}

function structToSource(struct: Struct): string {
    let structName = struct.name;
    let structContent = struct.member_variables.map((member) => {
        let memberName = member.name;
        let memberType = member.type.source;
        let memberComment = member.comment.split('\n').map((line) => `/// ${line}`).join('\n');
        return `
${memberComment}
${memberType} ${memberName};`.trim();
    }).join('\n\n');

    return `
struct ${structName} {
${structContent}
};`.trim();
}


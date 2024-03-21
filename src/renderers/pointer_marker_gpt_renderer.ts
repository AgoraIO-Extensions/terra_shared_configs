import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import _ from 'lodash';

import {
    ParseResult,
    RenderResult,
    TerraContext,
} from '@agoraio-extensions/terra-core';
import { askGPT } from '../utils/gpt_utils';
import { PointerArrayNameMapping, PointerMarkerParserConfigMarker } from '../parsers/pointer_marker_parser';
import { CXXFile, SimpleTypeKind, Struct } from '@agoraio-extensions/cxx-parser';

export interface PointerMarkerGPTRenderer {
    configPath?: string
}

export function PointerMarkerGPTRenderer(
    terraContext: TerraContext,
    args?: PointerMarkerGPTRenderer,
    parseResult?: ParseResult
): RenderResult[] {
    processGPT(parseResult!, args?.configPath);
    return [];
}

const prompt = `
You are a C++ Code Inspector. Your task is to identify "pointer field-length field" pairs within a given C++ struct. 
Exclude any pair where the pointer field's name is "buffer" or the pointer field type is "uint8_t" pointer. Additionally, disregard any pointer without a direct length field counterpart. 
Your output should be in JSON format, returning an empty array [] if no valid pairs are found, or [{"ptrName": "pointer_name", "lengthName": "length_field_name"}] for each valid pair found. 
The response MUST contains only the JSON result without any additional explanations.

Given struct:
\`\`\`c++
{{ STRUCT_SOURCE }}
\`\`\`
`;

const defualtConfigPath = path.resolve(`${__dirname}/../../configs/rtc/pointer_marker.config.ts`);
async function processGPT(parseResult: ParseResult, configPath?: string) {
    let originalConfigPath = configPath ?? defualtConfigPath;
    let originalMarkers = require(originalConfigPath).markers as PointerMarkerParserConfigMarker[];

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

            // let newJsonArray = jsonArray as PointerArrayNameMapping[];
            let newJsonArray: PointerArrayNameMapping[] = [];
            let originalMarker = originalMarkers.find((entry: any) => _.isMatch(struct, entry.node));
            if (originalMarker) {
                for (let om of (jsonArray as PointerArrayNameMapping[])) {
                    if (om.lengthName.length === 0) {
                        continue;
                    }
                    let found = originalMarker.pointerArrayNameMappings?.find((entry) => entry.ptrName === om.ptrName);
                    // Only add the ptrName if it's not found in the original marker
                    let toAdd = found ? found : om;
                    newJsonArray.push(toAdd);
                }
            }

            if (newJsonArray.length > 0) {
                let pointerArrayNameMappings = newJsonArray.map((entry: any) => {
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

    fs.writeFileSync(originalConfigPath, output);

    // Reformat the file
    execSync(`yarn prettier ${originalConfigPath} --write`, {
        cwd: path.resolve(__dirname, '../../'),
    });
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


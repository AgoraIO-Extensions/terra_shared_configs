import fs from 'fs';

import path from 'path';

import { CXXParserConfigs } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import YAML from 'yaml';

import { generateNodes } from '../utils/parser_utils';

import * as Parsers from './index';

import {
  FixEnumConstantParserArgs,
  OverrideNodeParserArgs,
  ReturnTypeParserArgs,
  UpdateSimpleTypeParserArgs,
} from './index';

export type RtcParserArgs = ReturnTypeParserArgs &
  OverrideNodeParserArgs &
  FixEnumConstantParserArgs &
  UpdateSimpleTypeParserArgs & {
    sdkVersion: string;
    definesMacros: string;
    configFilePath: string;
  };

export function formatCXXParserConfig(
  cxxParserConfigs: CXXParserConfigs,
  rtcParserArgs: RtcParserArgs
): CXXParserConfigs {
  let includeHeaderDirs = cxxParserConfigs.includeHeaderDirs.map((dir) =>
    dir?.replace('${SDK_VERSION}', `rtc_${rtcParserArgs.sdkVersion}`)
  );
  let parseFilesInclude = cxxParserConfigs.parseFiles.include.map((dir) =>
    dir?.replace('${SDK_VERSION}', `rtc_${rtcParserArgs.sdkVersion}`)
  );
  let parseFilesExclude = cxxParserConfigs.parseFiles.exclude.map((dir) =>
    dir?.replace('${SDK_VERSION}', `rtc_${rtcParserArgs.sdkVersion}`)
  );
  let cxxParserArgs: CXXParserConfigs = {
    includeHeaderDirs: includeHeaderDirs,
    definesMacros: rtcParserArgs.definesMacros,
    parseFiles: {
      include: parseFilesInclude,
      exclude: parseFilesExclude,
    },
    parseClangQualType: false,
  };
  return cxxParserArgs;
}

export function mergeArgs(parser: any, args: any): RtcParserArgs {
  if (args[parser.name] !== undefined) {
    parser.args = { ...parser.args, ...args[parser.name] };
  }
  return parser.args;
}

export function RTCParser(
  terraContext: TerraContext,
  args: RtcParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let yamlContent = fs.readFileSync(
    path.join(
      __dirname,
      args.configFilePath ?? '../../configs/rtc/rtc_config.yaml'
    ),
    'utf8'
  );
  let parsedYaml = YAML.parse(yamlContent);
  parsedYaml.parsers.map((parser: any) => {
    if (parser.name === 'CXXParser') {
      preParseResult = generateNodes(
        terraContext,
        formatCXXParserConfig(parser.args, args)
      );
    } else if (parser.name === 'OverrideNodeParser') {
      preParseResult = Parsers.OverrideNodeParser(
        terraContext,
        {
          customHeaderFileNamePrefix:
            args.customHeaderFileNamePrefix ??
            parser.args.customHeaderFileNamePrefix,
          ...formatCXXParserConfig(parser.args, args),
        },
        preParseResult
      );
    } else {
      preParseResult = (Parsers as any)[parser.name](
        terraContext,
        mergeArgs(parser, args),
        preParseResult
      );
    }
  });
  return preParseResult;
}

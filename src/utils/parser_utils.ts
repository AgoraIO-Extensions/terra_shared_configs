import {
  CXXParser,
  CXXParserConfigs,
  CXXTerraNode,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

import { BaseParserArgs } from '../parsers';

export const generateNodes = (
  parseConfig: TerraContext,
  cxxParserConfigs: CXXParserConfigs
): ParseResult | undefined => {
  return CXXParser(parseConfig, cxxParserConfigs, undefined);
};

export function getConfigs(args: BaseParserArgs, terraContext: TerraContext) {
  if (args.ignoreDefaultConfig) {
    args.defaultConfig = null;
  }
  let configs = args.defaultConfig;
  if (args.config) {
    configs = JSON.parse(args.config);
  }
  if (args.configFilePath) {
    let configPath = resolvePath(args.configFilePath, terraContext.configDir);
    configs = require(configPath);
  }
  if (args.defaultConfig) {
    if (configs instanceof Array) {
      configs = (configs as string[]).concat(args.defaultConfig);
    } else if (configs instanceof Object) {
      configs = Object.assign({}, configs, args.defaultConfig);
    }
  }
  return configs;
}

export enum CommentConfigKey {
  SOURCE = 'source',
  ACTION = 'action',
  IRIS_API_ID = 'iris_api_id',
}

export enum CommentAction {
  ADD = 'add',
  REPLACE = 'replace',
  REMOVE = 'remove',
}

export type CommentConfig = { key: CommentConfigKey; value: string };

export const getConfigsFromComments = (node: CXXTerraNode) => {
  const regex = /@(\w+):(.+?)(?=@|$)/gs;
  const matches = [...node.comment.matchAll(regex)];
  const configs: CommentConfig[] = matches.map((match) => {
    return {
      key: match[1] as CommentConfigKey,
      value: match[2].trim(),
    };
  });
  node.comment = '';
  return configs;
};

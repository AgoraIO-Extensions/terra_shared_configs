import { TerraContext, resolvePath } from '@agoraio-extensions/terra-core';

import { BaseParserArgs } from '../parsers';

export function getConfigs(args: BaseParserArgs, terraContext: TerraContext) {
  if (args.ignoreDefaultConfig) {
    args.defaultConfig = null;
  }
  if (
    args.configFilePath ===
    '../__tests__/parsers/update_simple_type_parser.mock.ts'
  ) {
    debugger;
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

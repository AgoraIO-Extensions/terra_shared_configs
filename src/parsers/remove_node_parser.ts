import { readFileSync } from 'fs';

import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type RemoveNodeParserArgs = {
  configJson?: string;
  configJsonFilePath?: string;
};

function filterNode<T extends CXXTerraNode>(
  nodes: T[],
  name_configs: string[],
  regex_configs: string[]
): T[] {
  return nodes.filter((node) => {
    var flag = true;
    if (name_configs.includes(node.fullName)) {
      // 配置表中配置了该node则过滤掉
      flag = false;
    }
    regex_configs.forEach((v) => {
      const regex = new RegExp(v);
      if (regex.test(node.realName)) {
        // 满足正则表达式则过滤掉
        flag = false;
      }
    });
    return flag;
  });
}

export function RemoveNodeParser(
  terraContext: TerraContext,
  args: RemoveNodeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  if (args.configJson === undefined) {
    args.configJson = readFileSync(
      resolvePath(args.configJsonFilePath!, terraContext.configDir)
      // getAbsolutePath(parseConfig.rootDir, args.configJsonFilePath)
    ).toString();
  }
  const configs: string[] = JSON.parse(args.configJson!);
  let name_configs = configs.filter(
    (v) => !v.startsWith('^') && !v.endsWith('$')
  );
  let regex_configs = configs.filter(
    (v) => v.startsWith('^') || v.endsWith('$')
  );
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes = filterNode(file.nodes, name_configs, regex_configs);
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        node.asStruct().member_variables = filterNode(
          node.asStruct().member_variables,
          name_configs,
          regex_configs
        );
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        node.asClazz().base_clazzs = filterNode(
          node.asClazz().base_clazzs.map((v) => {
            return { fullName: v } as CXXTerraNode;
          }),
          name_configs,
          regex_configs
        ).map((v) => v.fullName);
        node.asClazz().member_variables = filterNode(
          node.asClazz().member_variables,
          name_configs,
          regex_configs
        );
        node.asClazz().methods = filterNode(
          node.asClazz().methods,
          name_configs,
          regex_configs
        );
        node.asClazz().methods.forEach((method) => {
          method.parameters = filterNode(
            method.parameters,
            name_configs,
            regex_configs
          );
        });
      }
    });
  });
  return preParseResult;
}

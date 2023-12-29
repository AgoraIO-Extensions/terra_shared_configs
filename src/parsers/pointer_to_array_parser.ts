import { readFileSync } from 'fs';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  MemberVariable,
  SimpleTypeKind,
  Variable,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type PointerToArrayParserArgs = {
  configJson?: string;
  configJsonFilePath?: string;
};

function markArray(
  nodes: (Variable | MemberVariable)[],
  parentNode: CXXTerraNode,
  name_configs: string[],
  regex_configs: string[] = []
) {
  nodes.forEach((node) => {
    if (node.type.kind !== SimpleTypeKind.pointer_t) {
      return;
    }

    const config = name_configs.find(
      (v) => v === `${parentNode.fullName}.${node.name}`
    );
    if (config) {
      // 配置表中配置了该变量则标记为数组
      node.type.kind = SimpleTypeKind.array_t;
      return;
    }

    regex_configs.forEach((v) => {
      const regex = new RegExp(v);
      if (regex.test(node.name)) {
        // 满足正则表达式则标记为数组
        node.type.kind = SimpleTypeKind.array_t;
      }
    });

    // 名字以buffer、data结尾的，且原类型为void*，则为字节数组
    if (
      new RegExp('^.*(buffer|data)$', 'i').test(node.name) &&
      node.type.name === 'void'
    ) {
      node.type.name = 'uint8_t';
      node.type.kind = SimpleTypeKind.pointer_t;
    }
  });
}

export function PointerToArrayParser(
  terraContext: TerraContext,
  args: PointerToArrayParserArgs,
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
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        markArray(
          node.asStruct().member_variables,
          node,
          name_configs,
          regex_configs
        );
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        markArray(
          node.asClazz().member_variables,
          node,
          name_configs,
          regex_configs
        );
        node.asClazz().methods.forEach((method) => {
          markArray(method.parameters, method, name_configs, regex_configs);
        });
      }
    });
  });
  return preParseResult;
}

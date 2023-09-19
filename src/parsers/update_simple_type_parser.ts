import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext, resolvePath } from '@agoraio-extensions/terra-core';
import { readFileSync } from 'fs';

export type UpdateSimpleTypeParserArgs = {
  configJson?: string;
  configJsonFilePath?: string;
};

export type UpdateNodeConfig = Record<string, string>;

function updateNode<T extends CXXTerraNode>(node: T[] | T, configs: UpdateNodeConfig) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      updateNode(it, configs);
    });
  } else {
    const config = configs[node.fullName];
    if (config !== undefined) {
      node.source = config;
    }
    switch (node.__TYPE) {
      case CXXTYPE.MemberVariable:
        updateNode(node.asMemberVariable().type, configs);
        break;
      case CXXTYPE.Variable:
        updateNode(node.asVariable().type, configs);
        break;
      case CXXTYPE.MemberFunction:
        updateNode(node.asMemberFunction().return_type, configs);
        updateNode(node.asMemberFunction().parameters, configs);
        break;
      case CXXTYPE.SimpleType:
        Object.entries(configs).forEach(([k, v]) => {
          node.name = node.name.replace(new RegExp(k), v);
          node.source = node.source.replace(new RegExp(k), v);
        });
    }
  }
}

export function UpdateSimpleTypeParser(
  terraContext: TerraContext,
  _args: any,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let args = _args as UpdateSimpleTypeParserArgs;
  if (args.configJson === undefined) {
    args.configJson = readFileSync(
      resolvePath(args.configJsonFilePath!, terraContext.configDir)
      // getAbsolutePath(parseConfig.rootDir, args.configJsonFilePath)
    ).toString();
  }
  let configs = JSON.parse(args.configJson!);
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    updateNode(file.nodes, configs);
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        updateNode(node.asStruct().member_variables, configs);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        updateNode(node.asClazz().member_variables, configs);
        updateNode(node.asClazz().methods, configs);
      }
    });
  });
  return preParseResult;
}

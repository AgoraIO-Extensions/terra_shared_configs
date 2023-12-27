import { readFileSync } from 'fs';

import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type AssignSimpleTypeParserArgs = {
  config: string;
};

export type AssignNodeConfig = Record<string, string>;

function assignNode<T extends CXXTerraNode>(
  node: T[] | T,
  configs: AssignNodeConfig
) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      assignNode(it, configs);
    });
  } else {
    switch (node.__TYPE) {
      case CXXTYPE.MemberVariable:
        assignNode(node.asMemberVariable().type, configs);
        break;
      case CXXTYPE.Variable:
        assignNode(node.asVariable().type, configs);
        break;
      case CXXTYPE.MemberFunction:
        assignNode(node.asMemberFunction().return_type, configs);
        assignNode(node.asMemberFunction().parameters, configs);
        break;
      case CXXTYPE.SimpleType:
        if (configs[node.asSimpleType().fullName]) {
          node = Object.assign(node, configs[node.fullName]);
        }
    }
  }
}

export function AssignSimpleTypeParser(
  terraContext: TerraContext,
  args: AssignSimpleTypeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let configPath = resolvePath(args.config, terraContext.configDir);
  let configs = require(configPath);
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    assignNode(file.nodes, configs);
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        assignNode(node.asStruct().member_variables, configs);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        assignNode(node.asClazz().member_variables, configs);
        assignNode(node.asClazz().methods, configs);
      }
    });
  });
  return preParseResult;
}

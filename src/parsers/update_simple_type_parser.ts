import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type UpdateSimpleTypeParserArgs = {
  config: any;
  parserDefaultValue: boolean;
};

export type UpdateNodeConfig = Record<string, string | Function>;

export function updateSimpleTypeName(
  text: string,
  configs: UpdateNodeConfig
): string {
  Object.entries(configs).forEach(([k, v]) => {
    if (typeof v === 'string') {
      text = text.replace(new RegExp(k), v);
    }
  });
  return text;
}

function updateNode<T extends CXXTerraNode>(
  node: T[] | T,
  configs: UpdateNodeConfig,
  args: UpdateSimpleTypeParserArgs
) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      updateNode(it, configs, args);
    });
  } else {
    const config = configs[node.fullName];
    if (config !== undefined) {
      if (typeof config === 'object') {
        node.name = config['name'];
        node.source = config['source'];
        node.asSimpleType().is_const = config['is_const'];
        node.asSimpleType().kind = config['kind'];
        node.asSimpleType().is_builtin_type = config['is_builtin_type'];
      } else if (typeof config === 'string') {
        node.source = config;
      }
    }
    switch (node.__TYPE) {
      case CXXTYPE.MemberVariable:
        updateNode(node.asMemberVariable().type, configs, args);
        break;
      case CXXTYPE.Variable:
        updateNode(node.asVariable().type, configs, args);
        if (args.parserDefaultValue) {
          node.asVariable().default_value = updateSimpleTypeName(
            node.asVariable().default_value,
            configs
          );
        }
        break;
      case CXXTYPE.MemberFunction:
        updateNode(node.asMemberFunction().return_type, configs, args);
        updateNode(node.asMemberFunction().parameters, configs, args);
        break;
      case CXXTYPE.SimpleType:
        if (
          configs.hasOwnProperty('customHandle') &&
          typeof configs['customHandle'] === 'function'
        ) {
          node.name = (configs as any)['customHandle'](
            node.asSimpleType(),
            configs
          );
        } else {
          node.name = updateSimpleTypeName(node.asSimpleType().name, configs);
        }
    }
  }
}

export function UpdateSimpleTypeParser(
  terraContext: TerraContext,
  args: UpdateSimpleTypeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let configPath = resolvePath(args.config, terraContext.configDir);
  let configs = require(configPath);
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    updateNode(file.nodes, configs, args);
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        updateNode(node.asStruct().member_variables, configs, args);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        updateNode(node.asClazz().member_variables, configs, args);
        updateNode(node.asClazz().methods, configs, args);
      }
    });
  });
  return preParseResult;
}

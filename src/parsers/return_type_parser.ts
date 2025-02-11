import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  SimpleTypeKind,
  Variable,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { AIParameter } from '../../ai/doc_ai_tool_processor';

import { isOutputVariable } from '../utils';
import { getConfigs } from '../utils/parser_utils';

import { BaseParserArgs } from './index';

const AIConfigMethodParameters = require('../../configs/rtc/ai/parameter_list.ts');
const defaultConfig = require('../../configs/rtc/fixed_return_type_list.ts');

export type ReturnTypeParserArgs = BaseParserArgs & {
  convertReturnToVoid?: boolean;
};

export function ReturnTypeParser(
  terraContext: TerraContext,
  args: ReturnTypeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  const configs = getConfigs(
    {
      ...args,
      defaultConfig: defaultConfig,
    },
    terraContext
  );
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Clazz) {
        for (let i = 0; i < node.asClazz().methods.length; i++) {
          let method = node.asClazz().methods[i];
          if (configs[method.fullName]) {
            method.return_type = Object.assign(
              method.return_type,
              configs[method.fullName]
            );
            continue;
          }

          let pattern = '^(get|query).*$';
          if (!new RegExp(pattern).test(method.name)) {
            let pattern2 = '^(register|unregister)(.*)(Observer|EventHandler)$';
            if (new RegExp(pattern2).test(method.name)) {
              if (args?.convertReturnToVoid) {
                method.return_type.name = 'void';
                method.return_type.source = 'void';
                method.return_type.kind = SimpleTypeKind.value_t;
                method.return_type.is_const = false;
                method.return_type.is_builtin_type = true;
              }
              continue;
            }
            if (method.return_type.name == 'int' && args?.convertReturnToVoid) {
              method.return_type.name = 'void';
              method.return_type.source = 'void';
              method.return_type.kind = SimpleTypeKind.value_t;
              method.return_type.is_const = false;
              method.return_type.is_builtin_type = true;
            }
          }
          for (
            let p = 0;
            p < method.asMemberFunction().parameters.length;
            p++
          ) {
            let param = method.asMemberFunction().parameters[p];
            if (isOutputVariable(param) && args?.convertReturnToVoid) {
              method.return_type = param.type;
              method.user_data = {
                ...method.user_data,
                ReturnTypeParser: {
                  is_overrided_return_type: true,
                  outVariable: param,
                },
              };

              // Remove output variable from parameter list
              method.asMemberFunction().parameters.splice(p, 1);
              break;
            } else {
              if (isOutputVariable(param)) {
                // TODO(littlegnal): Remove the `is_output` in the future
                param.is_output = true;
                param.user_data = {
                  ...param.user_data,
                  ReturnTypeParser: {
                    is_overrided_return_type: true,
                    outVariable: param,
                  },
                };
              }
            }
            if (args.useAI) {
              let config: AIParameter =
                AIConfigMethodParameters[
                  `${param.parent?.parent?.name}:${param.parent?.name}.${param.name}`
                ];
              if (config && config.parent_name) {
                param.is_output = config.is_output;
              }
            }
          }
        }
      }
    });
  });
  return preParseResult;
}

export function isOverridedReturnType(node: CXXTerraNode): boolean {
  return node.user_data?.ReturnTypeParser?.is_overrided_return_type ?? false;
}

export function getOutVariable(node: CXXTerraNode): Variable | undefined {
  return node.user_data?.ReturnTypeParser?.outVariable;
}

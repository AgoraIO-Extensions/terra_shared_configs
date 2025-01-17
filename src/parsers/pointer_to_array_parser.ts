import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  MemberVariable,
  SimpleTypeKind,
  Variable,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { AIParameter } from '../../ai/doc_ai_tool_processor';

import { getConfigs } from '../utils/parser_utils';

import { BaseParserArgs } from './index';

const AIConfigMethodParameters = require('../../configs/rtc/ai/method_parameters.ts');
const defaultConfig = require('../../configs/rtc/pointer_to_array');

function markArray(
  args: BaseParserArgs,
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

    if (args.useAI) {
      let _config: AIParameter =
        AIConfigMethodParameters[
          `${node.parent?.parent?.name}:${node.parent?.name}.${node.name}@type`
        ];
      if (_config?.parent_name) {
        node.type.kind = SimpleTypeKind.array_t;
      }
    }

    if (
      node.parent?.__TYPE === CXXTYPE.MemberFunction &&
      node.__TYPE === CXXTYPE.Variable &&
      nodes.some(
        (n) => n.name === node.name + 'Count' || n.name === node.name + 'Size'
      )
    ) {
      node.type.kind = SimpleTypeKind.array_t;
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
  args: BaseParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  const configs = getConfigs(
    {
      ...args,
      defaultConfig: defaultConfig,
    },
    terraContext
  );
  let name_configs = configs.filter(
    (v: string) => !v.startsWith('^') && !v.endsWith('$')
  );
  let regex_configs = configs.filter(
    (v: string) => v.startsWith('^') || v.endsWith('$')
  );
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        markArray(
          args,
          node.asStruct().member_variables,
          node,
          name_configs,
          regex_configs.concat('^.*(s|list|array|List)$')
        );
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        markArray(
          args,
          node.asClazz().member_variables,
          node,
          name_configs,
          regex_configs.concat('^.*(list|array|List)$')
        );
        node.asClazz().methods.forEach((method) => {
          markArray(
            args,
            method.parameters,
            method,
            name_configs,
            regex_configs.concat('^.*(list|array|List)$')
          );
        });
      }
    });
  });
  return preParseResult;
}

import {
  CXXFile,
  CXXParserConfigs,
  CXXTYPE,
  EnumConstant,
  Enumz,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

const TYPES_SIZE: Record<string, string> = {
  'sizeof(int16_t)': '2',
};

export type FixEnumConstantParserArgs = CXXParserConfigs & {
  skipCalValue?: boolean;
};

function fixEnumConstantValue(
  enumz: Enumz,
  constant: EnumConstant,
  args: FixEnumConstantParserArgs
): string {
  let value = constant.source;
  enumz.enum_constants.forEach((it) => {
    if (value.includes(it.name)) {
      // 当前枚举值包含其他枚举值，需要替换，示例如下：
      // QUALITY_UNSUPPORTED = 7,
      // QUALITY_DETECTING = QUALITY_UNSUPPORTED,
      value = value.replace(it.name, it.value);
    }
  });
  Object.keys(TYPES_SIZE).forEach((it) => {
    if (value.includes(it)) {
      // 当前枚举值包含sizeof表达式，需要替换，示例如下：
      // QUALITY_UNSUPPORTED = sizeof(int16_t),
      value = value.replace(it, TYPES_SIZE[it] as string);
    }
  });
  if (!args?.skipCalValue) {
    if (!/^\d+$/.test(value)) {
      // 当前枚举值不是纯数字, 执行表达式计算，示例如下：
      // QUALITY_UNSUPPORTED = 1 << 4,
      return `${eval(`${value}`)}`;
    }
  }
  // 当前枚举值是纯数字, 直接返回
  return `${value}`;
}

export function FixEnumConstantParser(
  terraContext: TerraContext,
  args: FixEnumConstantParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  preParseResult?.nodes.forEach((file) => {
    (file as CXXFile).nodes.forEach((customNode) => {
      if (customNode.__TYPE === CXXTYPE.Enumz) {
        let enumz = customNode.asEnumz();
        let lastEnumValue = -1;
        enumz.enum_constants.forEach((enumConstant) => {
          if (enumConstant.source === '') {
            // 当前枚举source为空，需要Parser赋值，示例如下：
            // QUALITY_UNSUPPORTED = 7,
            // QUALITY_DETECTING,
            enumConstant.source = `${++lastEnumValue}`;
          }
          lastEnumValue = parseInt(enumConstant.source);
          if (isNaN(lastEnumValue)) {
            enumConstant.value = fixEnumConstantValue(
              enumz,
              enumConstant,
              args
            );
          } else {
            enumConstant.value = !args?.skipCalValue
              ? `${lastEnumValue}`
              : enumConstant.source;
          }
        });
      }
    });
  });
  return preParseResult;
}

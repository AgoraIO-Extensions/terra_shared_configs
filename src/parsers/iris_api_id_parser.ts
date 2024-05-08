import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Clazz,
  MemberFunction,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { irisApiId } from '../utils/iris_utils';

export interface IrisApiIdParserArgs {
  trim_params_hash?: boolean;
}

export interface IrisApiIdParserUserData {
  IrisApiIdParser: { key: string; value: string };
}

export function IrisApiIdParser(
  terraContext: TerraContext,
  args: IrisApiIdParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let trim_params_hash = args?.trim_params_hash ?? false;
  let cxxFiles = preParseResult?.nodes as CXXFile[];
  cxxFiles?.forEach((cxxFile: CXXFile) => {
    cxxFile.nodes.forEach((node) => {
      if (node.__TYPE == CXXTYPE.Clazz) {
        let clazz = node as Clazz;
        clazz.methods.forEach((method) => {
          applyIrisApiId(clazz, method, trim_params_hash);
        });
      }
    });
  });

  return preParseResult;
}

export function applyIrisApiId(
  clazz: Clazz,
  method: MemberFunction,
  trimParamsHash: boolean = false
) {
  let withParamsHash = !trimParamsHash;
  method.user_data ??= {};
  (method.user_data as IrisApiIdParserUserData).IrisApiIdParser = {
    key: irisApiId(clazz, method, {
      trimPrefix: '',
      toUpperCase: true,
    }),
    value: irisApiId(clazz, method, {
      toUpperCase: false,
      withParamsHash: withParamsHash,
    }),
  };
}

export function getIrisApiIdKey(node: CXXTerraNode): string {
  return (
    (node.user_data as IrisApiIdParserUserData)?.IrisApiIdParser?.key ?? ''
  );
}

export function getIrisApiIdValue(
  node: CXXTerraNode,
  noClassPrefix = false
): string {
  let value: string | undefined;
  if (noClassPrefix) {
    value = (node.user_data as IrisApiIdParserUserData)?.IrisApiIdParser?.value
      ?.split('_')
      ?.slice(1)
      ?.join('_');
  } else {
    value = (node.user_data as IrisApiIdParserUserData)?.IrisApiIdParser?.value;
  }
  return value ?? '';
}

export function adjustIrisApiIdKeyIfNeeded(
  clazz: Clazz,
  node: CXXTerraNode
): void {
  let key = getIrisApiIdKey(node);
  if (key.length) {
    key = [clazz.name.toUpperCase(), ...key.split('_').slice(1)].join('_');
    (node.user_data as IrisApiIdParserUserData)!.IrisApiIdParser.key = key;
  }
}

export function adjustIrisApiIdValueIfNeeded(
  clazz: Clazz,
  node: CXXTerraNode
): void {
  let value = getIrisApiIdValue(node);
  if (value.length) {
    value = [clazz.name.replace('I', ''), ...value.split('_').slice(1)].join(
      '_'
    );
    (node.user_data as IrisApiIdParserUserData).IrisApiIdParser!.value = value;
  }
}

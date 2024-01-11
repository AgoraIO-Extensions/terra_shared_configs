import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Clazz,
  MemberFunction,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

import { irisApiId } from '../utils/iris_utils';

export const defaultFuncNeedCheckWithBaseClasses = [
  'agora::media::IAudioFrameObserver',
  'agora::rtc::IRtcEngineEventHandlerEx',
];
function isNeedCheckWithBaseClasses(
  clazz: Clazz,
  funcNeedCheckWithBaseClasses: string[]
): boolean {
  return funcNeedCheckWithBaseClasses.includes(clazz.fullName);
}

export interface IrisApiIdParserArgs {
  configPath: string;
}

export interface IrisApiIdParserUserData {
  IrisApiIdParser: { key: string; value: string };
}

export function IrisApiIdParser(
  terraContext: TerraContext,
  args: IrisApiIdParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let funcNeedCheckWithBaseClasses: string[];
  if (args && args.configPath) {
    let configPath = resolvePath(args.configPath, terraContext.configDir);
    funcNeedCheckWithBaseClasses = require(configPath) as string[];
  } else {
    funcNeedCheckWithBaseClasses = defaultFuncNeedCheckWithBaseClasses;
  }

  let cxxFiles = preParseResult!.nodes as CXXFile[];
  cxxFiles.forEach((cxxFile: CXXFile) => {
    cxxFile.nodes.forEach((node) => {
      if (node.__TYPE == CXXTYPE.Clazz) {
        let clazz = node as Clazz;
        let needCheckWithBaseClasses = isNeedCheckWithBaseClasses(
          clazz,
          funcNeedCheckWithBaseClasses
        );
        clazz.methods.forEach((method) => {
          applyIrisApiId(
            preParseResult!,
            clazz,
            method,
            needCheckWithBaseClasses
          );
        });
      }
    });
  });

  return preParseResult;
}

export function applyIrisApiId(
  parseResult: ParseResult,
  clazz: Clazz,
  method: MemberFunction,
  includeBaseClassMethods: boolean = false
) {
  method.user_data ??= {};
  (method.user_data as IrisApiIdParserUserData).IrisApiIdParser = {
    key: irisApiId(parseResult, clazz, method, {
      trimPrefix: '',
      toUpperCase: true,
      includeBaseClassMethods: includeBaseClassMethods,
    }),
    value: irisApiId(parseResult, clazz, method, {
      toUpperCase: false,
      includeBaseClassMethods: includeBaseClassMethods,
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

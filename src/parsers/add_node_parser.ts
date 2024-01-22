import path from 'path';

import {
  CXXFile,
  CXXParserConfigs,
  CXXTYPE,
  Clazz,
  MemberFunction,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { irisApiId } from '../utils';
import {
  CommentAction,
  CommentConfig,
  CommentConfigKey,
  generateNodes,
  getConfigsFromComments,
} from '../utils/parser_utils';

import { IrisApiIdParserUserData } from './iris_api_id_parser';

export type AddNodeParserArgs = CXXParserConfigs & {
  customHeaderFileNamePrefix?: string;
};

export interface AddNodeParserUserData {
  AddNodeParser: MemberFunction;
}

export const AddNodeParser = (
  terraContext: TerraContext,
  args: AddNodeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined => {
  const customNodes = generateNodes(terraContext, args);
  customNodes?.nodes.forEach((f) => {
    let file = f as CXXFile;
    // find file which has same name after remove custrom prefix
    const foundFile = preParseResult?.nodes.find((it) => {
      return (
        path.basename(file.file_path) ===
        `${args.customHeaderFileNamePrefix}${path.basename(
          (it as CXXFile).file_path
        )}`
      );
    });
    if (!foundFile) {
      return;
    }

    file.nodes.forEach((customNode) => {
      if (!(customNode.__TYPE === CXXTYPE.Clazz)) {
        // only add enum and struct
        if (
          customNode.__TYPE === CXXTYPE.Enumz ||
          customNode.__TYPE === CXXTYPE.Struct
        ) {
          (foundFile as CXXFile).nodes.push(customNode);
        }
        return;
      }

      // find class which has same name
      const foundClass = (foundFile as CXXFile).nodes.find(
        (it) => it.__TYPE === CXXTYPE.Clazz && it.name === customNode.name
      ) as Clazz;
      if (!foundClass) {
        // add class if not found
        (foundFile as CXXFile).nodes.push(customNode);
        return;
      }

      (customNode as Clazz).methods.forEach((customMethod) => {
        let configs: CommentConfig[] = getConfigsFromComments(customMethod);
        let foundMethodIndex = -1;
        let irisApiIdValue = '';
        for (let config of configs) {
          switch (config.key) {
            case CommentConfigKey.SOURCE:
              // find method which has same name
              foundMethodIndex = foundClass.methods.findIndex(
                (it) => it.name === customMethod.name
              );
              break;
            case CommentConfigKey.IRIS_API_ID:
              // get iris api id from comment key IRIS_API_ID
              irisApiIdValue = config.value;
              break;
          }
        }
        if (foundMethodIndex == -1) {
          // add method if not found
          foundClass.methods.push(customMethod);
          return;
        }

        // mark method as custom
        // iris use nativeSDK origin cpp api signature, so we need call applyIrisApiId to add iris api id by foundClass.methods[foundMethodIndex]
        customMethod.user_data ??= {};
        (customMethod.user_data as IrisApiIdParserUserData).IrisApiIdParser = {
          key: '',
          value: irisApiIdValue,
        };

        customMethod.user_data = {
          ...customMethod.user_data,
          AddNodeParser: foundClass.methods[foundMethodIndex],
        };
        // replace method with custom method
        foundClass.methods[foundMethodIndex] = customMethod;
        // remove overload function unless it has been marked as custom
        foundClass.methods = foundClass.methods.filter(
          (it) => it.name !== customMethod.name || it.user_data?.AddNodeParser
        );
      });
    });
  });
  return preParseResult;
};

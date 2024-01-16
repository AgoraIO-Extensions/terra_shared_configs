import path from 'path';

import {
  CXXFile,
  CXXParserConfigs,
  CXXTYPE,
  Clazz,
  MemberFunction,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { generateNodes } from '../utils/parser_utils';

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
        // find method which has same name
        const foundMethodIndex = foundClass.methods.findIndex(
          (it) => it.name === customMethod.name
        );
        if (foundMethodIndex == -1) {
          // add method if not found
          foundClass.methods.push(customMethod);
          return;
        }

        // mark method as custom
        customMethod.user_data = {
          ...customMethod.user_data,
          AddNodeParser: foundClass.methods[foundMethodIndex],
        };
        // replace method with custom method
        foundClass.methods[foundMethodIndex] = customMethod;
        // remove overload function unless it has been marked as custom
        foundClass.methods = foundClass.methods.filter(
          (it) => it.name !== customMethod.name || it.user_data.AddNodeParser
        );
      });
    });
  });
  return preParseResult;
};

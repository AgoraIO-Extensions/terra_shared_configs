import { readFileSync } from 'fs';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Clazz,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type MergeNodeParserArgs = {
  config: string;
};

export type MergeNodeConfig = {
  source: string;
  target: string;
  deleteSource: boolean;
  user_data: any;
};

export function MergeNodeParser(
  terraContext: TerraContext,
  args: MergeNodeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let configPath = resolvePath(args.config, terraContext.configDir);
  let configs = require(configPath);
  if (preParseResult) {
    for (let config of configs) {
      let sourceClazz: CXXTerraNode | undefined = undefined;
      let targetClazz: CXXTerraNode | undefined = undefined;
      for (
        let fileIndex = 0;
        fileIndex < preParseResult.nodes.length;
        fileIndex++
      ) {
        let file = preParseResult.nodes[fileIndex] as CXXFile;
        if (!sourceClazz) {
          for (let index = 0; index < file.nodes.length; index++) {
            if (file.nodes[index]?.fullName === config.source) {
              // debugger;
              sourceClazz = file.nodes[index];

              //根据deleteSource来决定找到后是否删除source
              if (config.deleteSource) {
                delete file.nodes[index];
              }
              break;
            }
          }
        }
        if (!targetClazz) {
          for (let node of file.nodes) {
            if (node?.fullName === config.target) {
              targetClazz = node;
              break;
            }
          }
        }
        if (sourceClazz && targetClazz) {
          break;
        }
      }
      if (sourceClazz && targetClazz) {
        //move agora::rtc::IRtcEngineEventHandlerEx method to agora::rtc::IRtcEngineEventHandler
        targetClazz!.asClazz().methods.map((tar_method, tar_index) => {
          for (let i = 0; i < sourceClazz!.asClazz().methods.length; i++) {
            let sou_method = sourceClazz!.asClazz().methods[i];
            if (tar_method.name === sou_method.name) {
              targetClazz!.asClazz().methods[tar_index] = sou_method;
              break;
            }
          }
        });
      }
    }
  }
  return preParseResult;
}

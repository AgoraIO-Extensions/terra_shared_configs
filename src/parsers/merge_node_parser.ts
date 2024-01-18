import { CXXFile, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { MergeNodeConfig } from '../../configs/rtc/merge_node_list';

import { getConfigs } from '../utils/parser_utils';

import { BaseParserArgs, adjustIrisApiIdKeyIfNeeded, adjustIrisApiIdValueIfNeeded, applyIrisApiId } from './index';

const defaultConfig = require('../../configs/rtc/merge_node_list.ts');

export function MergeNodeParser(
  terraContext: TerraContext,
  args: BaseParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  const configs: MergeNodeConfig[] = getConfigs(
    {
      ...args,
      defaultConfig: defaultConfig,
    },
    terraContext
  );

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
              sourceClazz = file.nodes[index];

              //根据deleteSource来决定找到后是否删除source
              if (config.deleteSource) {
                // delete file.nodes[index];
                file.nodes.splice(index, 1);
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
        let isFilterOverloadFunctions =
          config.isFilterOverloadFunctions ?? true;
        if (isFilterOverloadFunctions) {
          targetClazz!.asClazz().methods.map((tar_method, tar_index) => {
            for (let i = 0; i < sourceClazz!.asClazz().methods.length; i++) {
              let sou_method = sourceClazz!.asClazz().methods[i];
              if (tar_method.name === sou_method.name) {
                let tarMethodParent = tar_method.parent;
                let tarMethodParentName = tar_method.parent_name;
                targetClazz!.asClazz().methods[tar_index] = sou_method;
                // Fix the relationship.
                targetClazz!.asClazz().methods[tar_index].parent =
                  tarMethodParent;
                targetClazz!.asClazz().methods[tar_index].parent_name =
                  tarMethodParentName;

                adjustIrisApiIdKeyIfNeeded(targetClazz!.asClazz(), targetClazz!.asClazz().methods[tar_index]);
                adjustIrisApiIdValueIfNeeded(targetClazz!.asClazz(), targetClazz!.asClazz().methods[tar_index]);
                break;
              }
            }
          });
        } else {
          targetClazz!.asClazz().methods = [
            ...targetClazz!.asClazz().methods,
            ...sourceClazz!.asClazz().methods,
          ].map((it) => {
            // Fix the relationship.
            it.parent = targetClazz;
            it.parent_name = targetClazz?.fullName ?? '';
            adjustIrisApiIdKeyIfNeeded(targetClazz!.asClazz(), it);
            adjustIrisApiIdValueIfNeeded(targetClazz!.asClazz(), it);

            return it;
          });
        }
      }
    }
  }
  return preParseResult;
}

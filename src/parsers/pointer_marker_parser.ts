import { CXXFile, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

import { checkObjInclude } from '../utils/obj_utils';

/**
 * Configuration example:
 *
 * ```ts
 * import { CXXTYPE } from "@agoraio-extensions/cxx-parser";
 *
 * module.exports = {
 *   markers: [
 *     {
 *       node: {
 *         __TYPE: CXXTYPE.Struct,
 *         name: "LiveTranscoding",
 *         namespaces: ["agora", "rtc"],
 *       },
 *       # The pointer array name mappings.
 *       pointerArrayNameMappings: [
 *         {
 *           ptrName: "transcodingUsers",
 *           lengthName: "userCount",
 *         },
 *       ],
 *     },
 *     {
 *       node: {
 *         __TYPE: CXXTYPE.Struct,
 *         name: "LocalSpatialAudioConfig",
 *         namespaces: ["agora", "rtc"],
 *       },
 *       # The pointer names.
 *       pointerNames: ["rtcEngine"],
 *     },
 *   ],
 * };
 * ```
 */
export type PointerMarkerParserArgs = {
  configPath: string;
};

export type PointerArrayNameMapping = {
  ptrName: string;
  lengthName: string;
};

/**
 * Configuration for the PointerMarkerParser.
 */
export type PointerMarkerParserConfigMarker = {
  // The `CXXTerraNode` to mark.
  node: CXXTerraNode;

  // The pointer array name mappings.
  pointerArrayNameMappings?: PointerArrayNameMapping[];

  // The pointer names of the `node`, which explicitly tell the renderers the name is a pointer.
  pointerNames?: string[];
};

export type PointerMarkerParserConfig = {
  markers: PointerMarkerParserConfigMarker[];
};

/**
 * Gets the pointer array name mapping for a given pointer name and Struct.
 * @param ptrName The pointer name.
 * @param node The CXXTerraNode.
 * @returns The pointer array name mapping or undefined.
 */
export function getPointerArrayNameMapping(
  ptrName: string,
  node: CXXTerraNode
): readonly [string, string] | undefined {
  if (!node.user_data) {
    return undefined;
  }

  let parserData = node.user_data['PointerMarkerParser'];
  if (!parserData || !parserData.pointerArrayNameMappings) {
    return undefined;
  }

  let pointerArrayNameMappings =
    parserData.pointerArrayNameMappings as PointerArrayNameMapping[];
  let mapping = pointerArrayNameMappings.find((v) => v.ptrName === ptrName);
  if (!mapping) {
    return undefined;
  }
  return [mapping.ptrName, mapping.lengthName];
}

/**
 * Checks if a given name is a pointer name in the specified struct, which is marked by `PointerMarkerParser`.
 * @param name - The name to check.
 * @param node - The CXXTerraNode to check against.
 * @returns True if the name is a pointer name, false otherwise.
 */
export function isPointerName(name: string, node: CXXTerraNode): boolean {
  if (!node.user_data) {
    return false;
  }

  let parserData = node.user_data['PointerMarkerParser'];
  if (!parserData || !parserData.pointerNames) {
    return false;
  }

  let pointerNames = parserData.pointerNames as string[];
  let mapping = pointerNames.find((it) => it === name);
  if (!mapping) {
    return false;
  }
  return true;
}

/**
 * Adds marker information for pointer arrays.
 */
export function PointerMarkerParser(
  terraContext: TerraContext,
  args: PointerMarkerParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let parseResult = preParseResult!;
  let configPath = resolvePath(args.configPath, terraContext.configDir);
  let config = require(configPath) as PointerMarkerParserConfig;

  parseResult.nodes.forEach((it) => {
    let cxxFile = it as CXXFile;
    cxxFile.nodes.forEach((node) => {
      applyPointerMarkerParserUserDataIfNeeded(config.markers, node);

      if (node.isClazz()) {
        node.asClazz().methods.forEach((method) => {
          applyPointerMarkerParserUserDataIfNeeded(config.markers, method);
        });
      }
    });
  });

  return parseResult;
}

function applyPointerMarkerParserUserDataIfNeeded(
  markers: PointerMarkerParserConfigMarker[],
  node: CXXTerraNode
) {
  for (let marker of markers) {
    let markerNode = marker.node;
    if (checkObjInclude(node, markerNode)) {
      node.user_data ??= {};
      node.user_data!['PointerMarkerParser'] = {
        pointerArrayNameMappings: marker.pointerArrayNameMappings ?? [],
        pointerNames: marker.pointerNames ?? [],
      };
    }
  }
}

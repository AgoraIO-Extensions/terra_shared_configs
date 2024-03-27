import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Clazz,
  Constructor,
  EnumConstant,
  Enumz,
  MemberFunction,
  MemberVariable,
  Variable,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';
import _ from 'lodash';

/**
 * Represents a node operation of CUD(Create/Update/Delete).
 */
export interface CUDNodeOp {
  /**
   * The node to operate on.
   */
  node: CXXTerraNode;
}

/**
 * Represents the configuration for deleting a `CXXTerraNode`.
 */
export interface CUDNodeDeleteConfig extends CUDNodeOp {}

/**
 * Represents the configuration for updating a `CXXTerraNode`.
 */
export interface CUDNodeUpdateConfig extends CUDNodeOp {
  /**
   * Represents the updated node.
   */
  updated: CXXTerraNode;
}

/**
 * Represents the configuration for `CUDNodeParser`.
 */
export interface CUDNodeConfig {
  /**
   * The nodes to delete.
   */
  deleteNodes?: CXXTerraNode[];

  /**
   * The nodes to update.
   */
  updateNodes?: CUDNodeUpdateConfig[];
}

/**
 * Represents the arguments for the CUDNodeParser.
 * Only one of `configPath` or `config` should be provided.
 */
export interface CUDNodeParserArgs {
  /**
   * The path to the configuration file.
   */
  configPath?: string;

  /**
   * The configuration object for the `CUDNodeConfig`.
   */
  config?: CUDNodeConfig;
}

/**
 * A common parser to handle the Create/Update/Delete operations on the nodes.
 *
 * @param terraContext - The `TerraContext`.
 * @param args - The arguments for the CUD node parser.
 * @param preParseResult - The `ParseResult`.
 * @returns The new `ParseResult` or undefined.
 */
export default function CUDNodeParser(
  terraContext: TerraContext,
  args: CUDNodeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let parseResult = preParseResult!;
  let config: CUDNodeConfig;
  if (args.configPath) {
    let configPath = resolvePath(args.configPath!, terraContext.configDir);
    config = require(configPath) as CUDNodeConfig;
  } else {
    config = args.config!;
  }

  if (config.deleteNodes && config.deleteNodes.length) {
    let ops = config.deleteNodes.map((it) => {
      return {
        node: it,
      } as CUDNodeDeleteConfig;
    });
    nodeOpInParseResult(parseResult, ops, deleteOp);
  }

  if (config.updateNodes && config.updateNodes.length) {
    nodeOpInParseResult(parseResult, config.updateNodes, updateOp);
  }

  return parseResult;
}

function filterNodes(
  sourceNodes: any[],
  nodesToFilter: any[],
  op: (sourceNode: CXXTerraNode, opConfig: CUDNodeOp) => boolean
): CXXTerraNode[] {
  return sourceNodes.filter((it) => {
    for (let n of nodesToFilter) {
      if (op(it, n)) {
        // if the op function return true, then filter the node
        return false;
      }
    }

    return true;
  });
}

function nodeOpInParseResult(
  originalParseResult: ParseResult,
  opNodes: CUDNodeOp[],
  op: (sourceNode: CXXTerraNode, opConfig: CUDNodeOp) => boolean
): ParseResult {
  // Remove nodes
  // 1. Remove CXXFile
  // 2. Remove Clazz

  let parseResult = originalParseResult;

  parseResult.nodes = filterNodes(
    parseResult.nodes,
    opNodes.filter((node) => node.node.__TYPE == CXXTYPE.CXXFile),
    op
  );

  parseResult.nodes.forEach((it) => {
    // Handle the parent nodes
    (it as CXXFile).nodes = filterNodes(
      (it as CXXFile).nodes,
      opNodes.filter((node) => node.node.__TYPE != CXXTYPE.CXXFile),
      op
    );

    // Handle the children nodes
    (it as CXXFile).nodes.forEach((it) => {
      // filter Clazz
      // filter Struct
      if (it.__TYPE == CXXTYPE.Struct || it.__TYPE == CXXTYPE.Clazz) {
        // The Struct is the sub class of Clazz
        let node = it as Clazz;

        node.constructors = filterNodes(
          node.constructors,
          opNodes.filter((node) => node.node.__TYPE == CXXTYPE.Constructor),
          op
        ) as Constructor[];

        node.methods = filterNodes(
          node.methods,
          opNodes.filter((node) => node.node.__TYPE == CXXTYPE.MemberFunction),
          op
        ) as MemberFunction[];
        node.methods.forEach((method) => {
          method.parameters = filterNodes(
            method.parameters,
            opNodes.filter((node) => node.node.__TYPE == CXXTYPE.Variable),
            op
          ) as Variable[];
        });

        node.member_variables = filterNodes(
          node.member_variables,
          opNodes.filter((node) => node.node.__TYPE == CXXTYPE.MemberVariable),
          op
        ) as MemberVariable[];
      } else if (it.__TYPE == CXXTYPE.Enumz) {
        // filter Enumz
        let node = it as Enumz;
        node.enum_constants = filterNodes(
          node.enum_constants,
          opNodes.filter((node) => node.node.__TYPE == CXXTYPE.EnumConstant),
          op
        ) as EnumConstant[];
      }
    });
  });

  return parseResult;
}

export function isNodeMatched(
  sourceNode: CXXTerraNode,
  nodeToMatch: any
): boolean {
  return _.isMatch(sourceNode, nodeToMatch);
}

/// The op coresponding to the `CUDNodeDeleteConfig`
function deleteOp(sourceNode: CXXTerraNode, opConfig: CUDNodeOp): boolean {
  return _.isMatch(sourceNode, opConfig.node);
}

/// The op coresponding to the `CUDNodeUpdateConfig`
function updateOp(sourceNode: CXXTerraNode, opConfig: CUDNodeOp): boolean {
  // https://lodash.com/docs/4.17.15#mergeWith
  function _customizer(objValue: any, srcValue: any) {
    if (_.isArray(objValue)) {
      for (let i = 0; i < srcValue.length; i++) {
        let srcValueItem = srcValue[i];

        for (let j = 0; j < objValue.length; j++) {
          let objValueItem = objValue[j];
          if (_.isMatch(Object.keys(objValueItem), Object.keys(srcValueItem))) {
            objValue[j] = _.merge(objValueItem, srcValueItem);
            break;
          }
        }
      }
    }
  }

  let updateOpConfig = opConfig as CUDNodeUpdateConfig;
  if (_.isMatch(sourceNode, updateOpConfig.node)) {
    _.mergeWith(sourceNode, updateOpConfig.updated, _customizer);
  }

  // We don't want to filter this node, but just update it.
  return false;
}

import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

export function OrderNodeParser(
  terraContext: TerraContext,
  args: any,
  preParseResult?: ParseResult
): ParseResult | undefined {
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    const parentNodes = new Map<string, CXXTerraNode>();
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct || node.__TYPE === CXXTYPE.Clazz) {
        parentNodes.set(node.name, node);
      }
    });
    file.nodes.forEach((node, index) => {
      if (node.__TYPE === CXXTYPE.Struct || node.__TYPE === CXXTYPE.Enumz) {
        if (parentNodes.has(node.parent_name)) {
          // 如果当前node属于某个父节点，那么将当前node放到父节点之前
          const parentNode = parentNodes.get(node.parent_name)!;
          file.nodes[index] = parentNode;
          file.nodes[file.nodes.findIndex((item) => item === parentNode)] =
            node;
        }
      }
    });
  });
  return preParseResult;
}

import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import {
  UpdateSimpleTypeParserArgs,
  updateSimpleTypeName,
} from './update_simple_type_parser';

function formatComment<T extends CXXTerraNode>(node: T[] | T) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      formatComment(it);
    });
  } else {
    node.comment = node.comment
      .replace(/^\n/, '* ')
      .replace(/\n$/, '')
      .replace(/\n/g, '\n* ');
    if (node.comment.length > 0) {
      node.comment = `/**\n${node.comment}\n*/`;
    } else {
      node.comment = '';
    }
  }
}

export function CommentParser(
  terraContext: TerraContext,
  args: UpdateSimpleTypeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        formatComment(node.asStruct());
        formatComment(node.asStruct().member_variables);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        formatComment(node.asClazz());
        formatComment(node.asClazz().member_variables);
        formatComment(node.asClazz().methods);
      } else if (node.__TYPE === CXXTYPE.Enumz) {
        formatComment(node.asEnumz());
        formatComment(node.asEnumz().enum_constants);
      }
    });
  });
  return preParseResult;
}

import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { BaseParserArgs, LANGUAGE } from './index';

/**
 * useage for mustache template:
 *    {{#comment}}
      {{{comment}}}
      {{/comment}}
 */
function formatComment<T extends CXXTerraNode>(
  node: T[] | T,
  args: BaseParserArgs
) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      formatComment(it, args);
    });
  } else {
    if (args.language === LANGUAGE.TS) {
      node.comment = node.comment
        .replace(/^\n/, '* ')
        .replace(/\n$/, '')
        .replace(/\n/g, '\n* ');
      if (node.comment.length > 0) {
        node.comment = `/**\n${node.comment}\n*/`;
      } else {
        node.comment = '';
      }
    } else {
      return node.comment;
    }
  }
}

export function CommentParser(
  terraContext: TerraContext,
  args: BaseParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        formatComment(node.asStruct(), args);
        formatComment(node.asStruct().member_variables, args);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        formatComment(node.asClazz(), args);
        formatComment(node.asClazz().member_variables, args);
        formatComment(node.asClazz().methods, args);
      } else if (node.__TYPE === CXXTYPE.Enumz) {
        formatComment(node.asEnumz(), args);
        formatComment(node.asEnumz().enum_constants, args);
      }
    });
  });
  return preParseResult;
}

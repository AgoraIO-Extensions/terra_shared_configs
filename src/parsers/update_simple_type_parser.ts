import { CXXFile, CXXTYPE, CXXTerraNode } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext, resolvePath } from '@agoraio-extensions/terra-core';
import { readFileSync } from 'fs';

export type UpdateSimpleTypeParserArgs = {
  configJson?: string;
  configJsonFilePath?: string;
};

export type UpdateNodeConfig = Record<string, string>;

// export class UpdateSimpleTypeParser extends Parser {
//   private args: UpdateSimpleTypeParserArgs;
//   private configs: UpdateNodeConfig = {};

//   constructor(args: UpdateSimpleTypeParserArgs) {
//     super();
//     this.args = args;
//   }

//   override parse(
//     parseConfig: TerraConfigs,
//     preParseResult?: ParseResult
//   ): ParseResult | undefined {
//     if (this.args.configJson === undefined) {
//       this.args.configJson = readFileSync(
//         getAbsolutePath(parseConfig.rootDir, this.args.configJsonFilePath)
//       ).toString();
//     }
//     this.configs = JSON.parse(this.args.configJson!);
//     preParseResult?.cxxFiles.forEach((file) => {
//       this.updateNode(file.nodes);
//       file.nodes.forEach((node) => {
//         if (node.__TYPE === CXXTYPE.Struct) {
//           this.updateNode(node.asStruct().member_variables);
//         } else if (node.__TYPE === CXXTYPE.Clazz) {
//           this.updateNode(node.asClazz().member_variables);
//           this.updateNode(node.asClazz().methods);
//         }
//       });
//     });
//     return preParseResult;
//   }

//   // private updateNode<T extends TerraNode>(node: T[] | T) {
//   //   if (Array.isArray(node)) {
//   //     node.forEach((it) => {
//   //       this.updateNode(it);
//   //     });
//   //   } else {
//   //     const config = this.configs[node.fullName];
//   //     if (config !== undefined) {
//   //       node.source = config;
//   //     }
//   //     switch (node.__TYPE) {
//   //       case CXXTYPE.MemberVariable:
//   //         this.updateNode(node.asMemberVariable().type);
//   //         break;
//   //       case CXXTYPE.Variable:
//   //         this.updateNode(node.asVariable().type);
//   //         break;
//   //       case CXXTYPE.MemberFunction:
//   //         this.updateNode(node.asMemberFunction().return_type);
//   //         this.updateNode(node.asMemberFunction().parameters);
//   //         break;
//   //       case CXXTYPE.SimpleType:
//   //         Object.entries(this.configs).forEach(([k, v]) => {
//   //           node.name = node.name.replace(new RegExp(k), v);
//   //           node.source = node.source.replace(new RegExp(k), v);
//   //         });
//   //     }
//   //   }
//   // }
// }

function updateNode<T extends CXXTerraNode>(node: T[] | T, configs: UpdateNodeConfig) {
  if (Array.isArray(node)) {
    node.forEach((it) => {
      updateNode(it, configs);
    });
  } else {
    const config = configs[node.fullName];
    if (config !== undefined) {
      node.source = config;
    }
    switch (node.__TYPE) {
      case CXXTYPE.MemberVariable:
        updateNode(node.asMemberVariable().type, configs);
        break;
      case CXXTYPE.Variable:
        updateNode(node.asVariable().type, configs);
        break;
      case CXXTYPE.MemberFunction:
        updateNode(node.asMemberFunction().return_type, configs);
        updateNode(node.asMemberFunction().parameters, configs);
        break;
      case CXXTYPE.SimpleType:
        Object.entries(configs).forEach(([k, v]) => {
          node.name = node.name.replace(new RegExp(k), v);
          node.source = node.source.replace(new RegExp(k), v);
        });
    }
  }
}

export function UpdateSimpleTypeParser(
  terraContext: TerraContext,
  _args: any,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let args = _args as UpdateSimpleTypeParserArgs;
  if (args.configJson === undefined) {
    args.configJson = readFileSync(
      resolvePath(args.configJsonFilePath!, terraContext.configDir)
      // getAbsolutePath(parseConfig.rootDir, args.configJsonFilePath)
    ).toString();
  }
  let configs = JSON.parse(args.configJson!);
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    updateNode(file.nodes, configs);
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        updateNode(node.asStruct().member_variables, configs);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        updateNode(node.asClazz().member_variables, configs);
        updateNode(node.asClazz().methods, configs);
      }
    });
  });
  return preParseResult;
}

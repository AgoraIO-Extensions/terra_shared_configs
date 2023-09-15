import { CXXFile, CXXTYPE, CXXTerraNode, MemberVariable, SimpleTypeKind, Variable } from '@agoraio-extensions/cxx-parser';
import { ParseResult, TerraContext, resolvePath } from '@agoraio-extensions/terra-core';
import { readFileSync } from 'fs';



export type PointerToArrayParserArgs = {
  configJson?: string;
  configJsonFilePath?: string;
};

// export class PointerToArrayParser extends Parser {
//   private args: PointerToArrayParserArgs;
//   private name_configs: string[] = [];
//   private regex_configs: string[] = [];

//   constructor(args: PointerToArrayParserArgs) {
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
//     const configs: string[] = JSON.parse(this.args.configJson!);
//     this.name_configs = configs.filter(
//       (v) => !v.startsWith('^') && !v.endsWith('$')
//     );
//     this.regex_configs = configs.filter(
//       (v) => v.startsWith('^') || v.endsWith('$')
//     );
//     preParseResult?.cxxFiles.forEach((file) => {
//       file.nodes.forEach((node) => {
//         if (node.__TYPE === CXXTYPE.Struct) {
//           this.markArray(node.asStruct().member_variables, node);
//         } else if (node.__TYPE === CXXTYPE.Clazz) {
//           this.markArray(node.asClazz().member_variables, node);
//           node.asClazz().methods.forEach((method) => {
//             this.markArray(method.parameters, method);
//           });
//         }
//       });
//     });
//     return preParseResult;
//   }

//   // private markArray(
//   //   nodes: (Variable | MemberVariable)[],
//   //   parentNode: TerraNode
//   // ) {
//   //   nodes.forEach((node) => {
//   //     if (node.type.kind !== SimpleTypeKind.pointer_t) {
//   //       return;
//   //     }

//   //     const config = this.name_configs.find(
//   //       (v) => v === `${parentNode.fullName}.${node.realName}`
//   //     );
//   //     if (config) {
//   //       // 配置表中配置了该变量则标记为数组
//   //       node.type.kind = SimpleTypeKind.array_t;
//   //       return;
//   //     }

//   //     this.regex_configs.forEach((v) => {
//   //       const regex = new RegExp(v);
//   //       if (regex.test(node.realName)) {
//   //         // 满足正则表达式则标记为数组
//   //         node.type.kind = SimpleTypeKind.array_t;
//   //       }
//   //     });
//   //   });
//   // }
// }

function markArray(
  nodes: (Variable | MemberVariable)[],
  parentNode: CXXTerraNode,
  name_configs: string[],
  regex_configs: string[] = []
) {
  nodes.forEach((node) => {
    if (node.type.kind !== SimpleTypeKind.pointer_t) {
      return;
    }

    const config = name_configs.find(
      (v) => v === `${parentNode.fullName}.${node.realName}`
    );
    if (config) {
      // 配置表中配置了该变量则标记为数组
      node.type.kind = SimpleTypeKind.array_t;
      return;
    }

    regex_configs.forEach((v) => {
      const regex = new RegExp(v);
      if (regex.test(node.realName)) {
        // 满足正则表达式则标记为数组
        node.type.kind = SimpleTypeKind.array_t;
      }
    });
  });
}

export function PointerToArrayParser(
  terraContext: TerraContext,
  _args: any,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let args = _args as PointerToArrayParserArgs;

  if (args.configJson === undefined) {
    args.configJson = readFileSync(
      resolvePath(args.configJsonFilePath!, terraContext.configDir)
      // getAbsolutePath(parseConfig.rootDir, args.configJsonFilePath)
    ).toString();
  }
  const configs: string[] = JSON.parse(args.configJson!);
  let name_configs = configs.filter(
    (v) => !v.startsWith('^') && !v.endsWith('$')
  );
  let regex_configs = configs.filter(
    (v) => v.startsWith('^') || v.endsWith('$')
  );
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Struct) {
        markArray(node.asStruct().member_variables, node, name_configs, regex_configs);
      } else if (node.__TYPE === CXXTYPE.Clazz) {
        markArray(node.asClazz().member_variables, node, name_configs, regex_configs);
        node.asClazz().methods.forEach((method) => {
          markArray(method.parameters, method, name_configs, regex_configs);
        });
      }
    });
  });
  return preParseResult;
}

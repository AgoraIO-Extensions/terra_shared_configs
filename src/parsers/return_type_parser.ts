import {
  CXXFile,
  CXXTYPE,
  SimpleTypeKind,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  TerraContext,
  resolvePath,
} from '@agoraio-extensions/terra-core';

export type ReturnTypeParserArgs = {
  convertReturnToVoid: boolean;
  config: string;
};

export function ReturnTypeParser(
  terraContext: TerraContext,
  args: ReturnTypeParserArgs,
  preParseResult?: ParseResult
): ParseResult | undefined {
  let configPath = resolvePath(args.config, terraContext.configDir);
  let configs = require(configPath);
  preParseResult?.nodes.forEach((f) => {
    let file = f as CXXFile;
    file.nodes.forEach((node) => {
      if (node.__TYPE === CXXTYPE.Clazz) {
        for (let i = 0; i < node.asClazz().methods.length; i++) {
          let method = node.asClazz().methods[i];
          if (configs[method.fullName]) {
            method.return_type = Object.assign(
              method.return_type,
              configs[method.fullName]
            );
            continue;
          }

          let pattern = '^(get|query).*$';
          if (!new RegExp(pattern).test(method.name)) {
            let pattern2 = '^(register|unregister)(.*)(Observer|EventHandler)$';
            if (new RegExp(pattern2).test(method.name)) {
              if (args.convertReturnToVoid) {
                method.return_type.name = 'void';
                method.return_type.source = 'void';
                method.return_type.kind = SimpleTypeKind.value_t;
                method.return_type.is_const = false;
                method.return_type.is_builtin_type = true;
              }
              continue;
            }
            if (method.return_type.name == 'int' && args.convertReturnToVoid) {
              method.return_type.name = 'void';
              method.return_type.source = 'void';
              method.return_type.kind = SimpleTypeKind.value_t;
              method.return_type.is_const = false;
              method.return_type.is_builtin_type = true;
            }
          }
          for (let p in method.asMemberFunction().parameters) {
            let param = method.asMemberFunction().parameters[p];
            if (args.convertReturnToVoid) {
              method.return_type = param.type;
              method.user_data = param;
              break;
            } else {
              if (
                (param.type.kind === SimpleTypeKind.pointer_t ||
                  param.type.kind === SimpleTypeKind.array_t ||
                  param.type.kind === SimpleTypeKind.reference_t) &&
                !param.type.is_const
              ) {
                param.is_output = true;
              }
            }
          }
        }
      }
    });
  });
  return preParseResult;
}

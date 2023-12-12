import {
  Clazz,
  MemberFunction,
  SimpleTypeKind,
} from '@agoraio-extensions/cxx-parser';

export function irisApiType(clazz: Clazz, mf: MemberFunction): string {
  const ptrEscape = 'ptr';
  const refEscape = 'ref';
  const whitespaceEscape = '_';
  const seperator = '__';

  let ps = mf.parameters
    .map((param) => {
      let out = param.type.name.replaceAll('::', whitespaceEscape);

      if (param.type.is_const) {
        out = `const${whitespaceEscape}${out}`;
      }
      if (param.type.kind === SimpleTypeKind.pointer_t) {
        out += `${whitespaceEscape}${ptrEscape}`;
      } else if (param.type.kind === SimpleTypeKind.reference_t) {
        out += `${whitespaceEscape}${refEscape}`;
      }

      return out;
    })
    .join(seperator);

  return `${clazz.name.trimNamespace()}${seperator}${mf.name}${seperator}${ps}`;
}

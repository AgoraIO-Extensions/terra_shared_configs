import { Clazz, MemberFunction } from '@agoraio-extensions/cxx-parser';
import { ParseResult } from '@agoraio-extensions/terra-core';

/**
 * Generates an API type schema for a given class and member function.
 * The schema follows the format `<Class Name>_<Function Name>[_<Full API Type Hash Code>]`.
 * If the member function is an overload, the hash code will be appended to the end of the schema.
 *
 * @param clazz - The class object.
 * @param mf - The member function object.
 * @param options - Optional configuration options.
 * @param options.withClassName - Whether to include the class name in the schema. Default is `true`.
 * @param options.withFuncName - Whether to include the function name in the schema. Default is `true`.
 * @param options.toUpperCase - Whether to convert the class and function names to uppercase. Default is `true`.
 * @returns The generated API type schema.
 */
export function irisApiId(
  parseResult: ParseResult,
  clazz: Clazz,
  mf: MemberFunction,
  options?: {
    withClassName?: boolean;
    withFuncName?: boolean;
    toUpperCase?: boolean;
    trimPrefix?: string; // default is "I"
    includeBaseClassMethods?: boolean;
  }
): string {
  // Borrow from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  function _stringHashCode(source: string): number {
    let length = source.length;
    let hash = 0,
      i,
      chr;
    if (length === 0) return hash;
    for (i = 0; i < length; i++) {
      chr = source.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  function _isOverload(
    cls: Clazz,
    f: MemberFunction,
    includeBaseClassMethods: boolean
  ): boolean {
    let allMethods = cls.methods ?? [];
    if (includeBaseClassMethods) {
      let baseClassMethods = cls.base_clazzs
        .map((it) => {
          return parseResult.resolveNodeByName(it);
        })
        .flatMap((it) => {
          return it?.asClazz()?.methods ?? [];
        })
        .filter((it) => !it.is_overriding); // filter out overriding methods

      allMethods = [...baseClassMethods, ...allMethods];

      let visitedMethods: Set<string> = new Set();
      allMethods = allMethods.filter((it) => {
        let funcSig = `${it.name}(${it.parameters
          .map((param) => param.type.source)
          .join(',')})`;
        if (visitedMethods.has(funcSig)) {
          return false;
        }
        visitedMethods.add(funcSig);
        return true;
      });
    }

    return allMethods.filter((m) => m.name === f.name).length > 1;
  }

  const seperator = '__';
  const shortSeperator = '_';

  let toUpperCase = options?.toUpperCase ?? true;
  let withClassName = options?.withClassName ?? true;
  let withFuncName = options?.withFuncName ?? true;
  let trimPrefix = options?.trimPrefix ?? 'I';
  let includeBaseClassMethods = options?.includeBaseClassMethods ?? false;

  let cn = clazz.name.trimNamespace();
  let mn = mf.name;

  if (toUpperCase) {
    cn = cn.toUpperCase();
    mn = mn.toUpperCase();
  }

  let output = '';
  let isOverload = _isOverload(clazz, mf, includeBaseClassMethods);
  // We use single one underscore `shortSeperator` for display purpose
  // <Class Name [Uppercase]>_<Function Name [Uppercase]>[_<Full API Type Hash Code>]
  if (withClassName) {
    output = cn;
  }

  if (withFuncName) {
    if (withClassName) {
      output += shortSeperator;
    }
    output = `${output}${mn}`;
  }

  if (isOverload) {
    let ps = mf.parameters
      .map((param) => {
        return param.type.source;
      })
      .join(seperator);

    // <Class Name>__<Function Name>__<Param Type1>__<Param Type2>__<...>
    let apiType = `${clazz.name.trimNamespace()}${seperator}${
      mf.name
    }${seperator}${ps}`;
    // Convert to hex string, and remove the negative `-`.
    let hc = _stringHashCode(apiType).toString(16).replace('-', '');

    output = `${output}${shortSeperator}${hc}`;
  }

  if (trimPrefix.length > 0 && output.startsWith(trimPrefix)) {
    output = output.replace(trimPrefix, '');
  }

  return output;
}

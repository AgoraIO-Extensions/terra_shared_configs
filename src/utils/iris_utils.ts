import crypto from 'crypto';

import { Clazz, MemberFunction } from '@agoraio-extensions/cxx-parser';

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
  clazz: Clazz,
  mf: MemberFunction,
  options?: {
    withClassName?: boolean;
    withFuncName?: boolean;
    toUpperCase?: boolean;
    trimPrefix?: string; // default is "I"
  }
): string {
  function _stringHashCode(source: string): string {
    if (source.length == 0) {
      return '';
    }

    const fullHash = crypto.createHash('sha1').update(source).digest('hex');
    return fullHash.substring(0, 7);
  }

  const seperator = '__';
  const shortSeperator = '_';

  let toUpperCase = options?.toUpperCase ?? true;
  let withClassName = options?.withClassName ?? true;
  let withFuncName = options?.withFuncName ?? true;
  let trimPrefix = options?.trimPrefix ?? 'I';

  let cn = clazz.name.trimNamespace();
  let mn = mf.name;

  if (toUpperCase) {
    cn = cn.toUpperCase();
    mn = mn.toUpperCase();
  }

  let output = '';
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

  let ps = mf.parameters
    .map((param) => {
      return param.type.source;
    })
    .join(seperator);

  let apiType = ps;
  let hc = apiType.length > 0 ? _stringHashCode(apiType) : '';

  if (hc.length) {
    output = `${output}${shortSeperator}${hc}`;
  }

  if (trimPrefix.length > 0 && output.startsWith(trimPrefix)) {
    output = output.replace(trimPrefix, '');
  }

  return output;
}

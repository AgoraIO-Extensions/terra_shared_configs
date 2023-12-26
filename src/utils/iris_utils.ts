import { Clazz, MemberFunction } from '@agoraio-extensions/cxx-parser';

/**
 * Return the API type schema `<Class Name [Uppercase]>_<Function Name [Uppercase]>_<Full API Type Hash Code>`.
 * @param clazz The `Clazz`
 * @param mf The `MemberFunction`
 * @param returnHashCodeOnly Only return the hash code string
 * @returns
 */
export function irisApiType(
  clazz: Clazz,
  mf: MemberFunction,
  options?: {
    withClassName?: boolean;
    withFuncName?: boolean;
    toUpperCase?: boolean;
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

  const seperator = '__';
  const shortSeperator = '_';

  let toUpperCase = options?.toUpperCase ?? true;
  let withClassName = options?.withClassName ?? true;
  let withFuncName = options?.withFuncName ?? true;

  let ps = mf.parameters
    .map((param) => {
      return param.type.source;
    })
    .join(seperator);

  // <Class Name>__<Function Name>__<Param Type1>__<Param Type2>__<...>
  let apiType = `${clazz.name.trimNamespace()}${seperator}${
    mf.name
  }${seperator}${ps}`;
  // Convert to hex string
  let hc = _stringHashCode(apiType).toString(16);

  let cn = clazz.name.trimNamespace();
  let mn = mf.name;

  if (toUpperCase) {
    cn = cn.toUpperCase();
    mn = mn.toUpperCase();
  }

  let output = hc;

  // We use single one underscore `shortSeperator` for display purpose
  // <Class Name [Uppercase]>_<Function Name [Uppercase]>_<Full API Type Hash Code>
  if (withFuncName) {
    output = `${mn}${shortSeperator}${hc}`;
  }
  if (withClassName) {
    output = `${cn}${shortSeperator}${output}`;
  }

  return output;
}

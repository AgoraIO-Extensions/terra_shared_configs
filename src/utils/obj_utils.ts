/**
 * Checks if a property in an object is equal to a given value.
 * If the value is a string, it performs a regular expression test.
 * @param obj - The object to check.
 * @param key - The key of the property to check.
 * @param value - The value to compare against the property.
 * @returns True if the property is equal to the value, false otherwise.
 */
export function checkPropertyEq(obj: any, key: string, value: any): boolean {
  if (!obj.hasOwnProperty(key)) {
    return false;
  }

  let eq = obj[key] == value;

  if (!eq && typeof value === 'string') {
    eq = new RegExp(value).test(obj[key]);
  }

  return eq;
}

/**
 * Checks if an object includes all the properties and values of another object.
 * Recursively checks nested objects.
 * @param obj1 - The object to check.
 * @param obj2 - The object to compare against.
 * @returns True if obj1 includes all properties and values of obj2, false otherwise.
 */
export function checkObjInclude(obj1: any, obj2: any): boolean {
  let isIncluded = true;

  if (!obj2) {
    return isIncluded;
  }

  for (let k2 of Object.keys(obj2)) {
    let v1 = obj1[k2];
    let v2 = obj2[k2];
    if (v1) {
      if (typeof v1 === 'object' && typeof v2 === 'object') {
        isIncluded = isIncluded && checkObjInclude(v1, v2);
      } else {
        isIncluded = isIncluded && checkPropertyEq(obj1, k2, obj2[k2]);
      }
      if (!isIncluded) {
        break;
      }
    }
  }

  return isIncluded;
}

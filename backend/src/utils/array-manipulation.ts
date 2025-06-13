function getValueByPath(obj: any, path: string[]): any {
  return path.reduce(
    (acc, key) => (acc && key in acc ? acc[key] : undefined),
    obj,
  );
}

function setValueByPath(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: rest.length
      ? setValueByPath(obj?.[head] ?? {}, rest, value)
      : value,
  };
}

function removeValueByPath(obj: any, path: string[]): any {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (!(head in obj)) return obj;
  if (rest.length === 0) {
    const { [head]: _, ...restObj } = obj;
    return restObj;
  }
  return {
    ...obj,
    [head]: removeValueByPath(obj[head], rest),
  };
}

export function renameObjectKeys<T extends object>(
  obj: T,
  keyMap: Record<string, string>,
): T {
  let result: any = { ...obj };
  for (const [oldPath, newPath] of Object.entries(keyMap)) {
    const oldKeys = oldPath.split(".");
    const newKeys = newPath.split(".");
    const value = getValueByPath(result, oldKeys);
    if (value !== undefined) {
      result = setValueByPath(result, newKeys, value);
      result = removeValueByPath(result, oldKeys);
    }
  }
  return result;
}

/**
 * Removes multiple keys (including deep paths) from an object.
 * @param obj The source object.
 * @param keys Array of keys or deep paths (e.g., 'deep.nested.key') to remove.
 * @returns A new object without the specified keys.
 */
export function removeObjectKeys<T extends object>(obj: T, keys: string[]): T {
  let result: any = { ...obj };
  for (const path of keys) {
    const pathArr = path.split(".");
    result = removeValueByPath(result, pathArr);
  }
  return result;
}

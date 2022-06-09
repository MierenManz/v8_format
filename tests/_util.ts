export function sparseArray(filled = false) {
  const arr = new Array(3);
  arr[2] = null;
  if (filled) arr.push(...Object.values(fullObject()));
  return arr;
}

export function denseArray(filled = false) {
  const arr: unknown[] = [null];
  if (filled) arr.push(...Object.values(fullObject()));
  return arr;
}

export function associativeArray<T>(filled = false): T[] {
  // deno-lint-ignore no-explicit-any
  const arr = [] as any;
  arr[1.1] = null;
  arr["key"] = "value";
  arr["int"] = 12;
  arr["float"] = 12.58;
  arr["boolT"] = true;
  arr["boolF"] = false;
  arr["NULL"] = null;
  arr["undefined"] = undefined;
  arr["bigint"] = 12n;
  arr["ref"] = arr;
  arr["denseArray"] = denseArray(filled);
  arr["sparseArray"] = sparseArray(filled);
  arr["emptyObject"] = {};
  arr["fullObject"] = fullObject();
  arr["ref"] = arr;
  return arr;
}

export function mixedArray<T>(dense = true): T[] {
  const arr = dense ? denseArray(true) : sparseArray(true);
  const secondArray = associativeArray(true);
  for (const key in secondArray) {
    arr[key] = secondArray[key];
  }

  return arr as T[];
}

// deno-lint-ignore ban-types
export function fullObject(): {} {
  return {
    1.1: null,
    key: "value",
    int: 12,
    float: 12.58,
    true: true,
    false: false,
    null: null,
    undefined: undefined,
    bigint: 12n,
    sparseArray: sparseArray(),
    denseArray: denseArray(),
    emptyObject: {},
  };
}

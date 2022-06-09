const VALUES = [
  null,
  "value",
  12,
  12.58,
  true,
  false,
  null,
  undefined,
  12n,
  {},
  [],
];
VALUES.push(VALUES);

export function sparseArray() {
  const arr = new Array(3);
  arr[2] = null;
  arr.push(...VALUES);
  return arr;
}

export function denseArray() {
  return [...VALUES];
}

export function associativeArray<T>(baseArray: T[]): T[] {
  // deno-lint-ignore no-explicit-any
  const arr: any = baseArray;
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
  arr["denseArray"] = denseArray();
  arr["sparseArray"] = sparseArray();
  arr["emptyObject"] = {};
  arr["fullObject"] = fullObject();
  return arr;
}

export function mixedArray<T>(dense: boolean): T[] {
  const arr = dense ? denseArray() : sparseArray();
  associativeArray(arr);

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

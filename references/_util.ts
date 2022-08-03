const MIN_INT_VALUE = -1_073_741_824;
const MAX_INT_VALUE = 1_073_741_823;

export interface ArrayMetadata {
  isSparse: boolean;
  indexedLength: number;
  unindexedLength: number;
}

export function arrayMetadata<T>(array: T[]): ArrayMetadata {
  const [indexedLength, unindexedLength] = Object.keys(array).reduce(
    (acc, cur) => {
      acc[strIsIntIndex(cur) ? 0 : 1]++;
      return acc;
    },
    [0, 0],
  );

  return {
    isSparse: indexedLength !== array.length,
    indexedLength: indexedLength,
    unindexedLength: unindexedLength,
  };
}

/**
 * Object keys that are strings should sometimes be serialized into integers if they can be a valid v8 signed integer.
 */
export function strIsIntIndex(val: string): boolean {
  const valAsInt = parseInt(val);
  return !Number.isNaN(valAsInt) &&
    valAsInt >= MIN_INT_VALUE &&
    valAsInt <= MAX_INT_VALUE &&
    valAsInt === parseFloat(val);
}

export function isValidInt(val: number): boolean {
  const valAsInt = val | 0;
  return valAsInt === val &&
    !Number.isNaN(valAsInt) &&
    valAsInt >= MIN_INT_VALUE &&
    valAsInt <= MAX_INT_VALUE;
}

/**
 * copy bytes to the front of the array and nullifying data behind it.
 * effectively consuming it
 */
export function consume(data: Uint8Array, length: number) {
  data.copyWithin(0, length);
  data.fill(0, data.length - length);
}

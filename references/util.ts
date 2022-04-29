import { encode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

export function serializeReference(idx: number): Uint8Array {
  const varint = encode(idx)[0];
  return new Uint8Array([0x5E, ...varint]);
}

export interface ArrayMetadata {
  isSparse: boolean;
  indexedLength: number;
  unindexedLength: number;
}

export function arrayMetadata<T>(array: T[]): ArrayMetadata {
  const metadata: ArrayMetadata = {
    isSparse: false,
    indexedLength: 0,
    unindexedLength: 0,
  };

  for (const key in array) {
    if (Number.isNaN(parseInt(key))) {
      metadata.unindexedLength++;
      continue;
    }
    metadata.indexedLength++;
  }

  if (metadata.indexedLength !== array.length) {
    metadata.isSparse = true;
  }
  return metadata;
}

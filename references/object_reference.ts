import { encode as varintEncode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

export function serializeReference(idx: number): Uint8Array {
  const varint = varintEncode(idx)[0];
  return new Uint8Array([0x5E, ...varint]);
}

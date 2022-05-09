import { varintDecode, varintEncode } from "./_deps.ts";
import { consume } from "./_util.ts";

export function serializeReference(idx: number): Uint8Array {
  const varint = varintEncode(idx)[0];
  return new Uint8Array([0x5E, ...varint]);
}

export function deserializeReference(
  data: Uint8Array,
  // deno-lint-ignore ban-types
  objRefs: {}[],
  // deno-lint-ignore ban-types
): {} {
  if (data[0] !== 0x5E) throw new Error("Not a v8 object reference");
  const [idx, bytesUsed] = varintDecode(data, 1);
  consume(data, bytesUsed);
  return objRefs[idx];
}

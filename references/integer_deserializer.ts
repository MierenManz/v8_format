import { decode32 as varintDecode } from "https://deno.land/x/varint@v2.0.0/varint.ts";

export function deserializeV8Integer(data: Uint8Array): number {
  if (data[0] !== 0x49) throw new Error("Not a v8 integer");
  //   Varint Decode
  const rawValue = varintDecode(data.subarray(1))[0];

  //   ZigZag Decode
  return (rawValue >> 1) ^ -(rawValue & 1);
}

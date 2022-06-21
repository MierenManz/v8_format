import { varintDecode, varintEncode } from "./_deps.ts";

export function serializeArrayBuffer(buff: ArrayBuffer) {
  const view = new Uint8Array(buff);
  const [varint, bytes] = varintEncode(buff.byteLength);

  const data = new Uint8Array(buff.byteLength + 1 + bytes);
  data[0] = 0x42;
  data.set(varint, 1);
  data.set(view, bytes + 1);

  return data;
}

export function deserializeArrayBuffer(data: Uint8Array): ArrayBuffer {
  if (data[0] !== 0x42) throw new Error("Not a serialized ArrayBuffer");
  const [_, offset] = varintDecode(data, 1);
  const ab = Uint8Array.from(data.subarray(offset));
  return ab;
}

export function serializeJsBoolean(bool: boolean): Uint8Array {
  if (typeof bool !== "boolean") throw new Error("Not a boolean");
  if (bool) {
    return new Uint8Array([0x54]);
  }

  return new Uint8Array([0x46]);
}

export function deserializeV8Boolean(data: Uint8Array): boolean {
  if (data[0] === 0x54) return true;
  if (data[0] === 0x46) return false;
  throw new Error("Not a v8 boolean");
}

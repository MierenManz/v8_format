interface DenoCore {
  core: {
    deserialize<T>(data: Uint8Array): T;
    serialize<T>(data: T): Uint8Array;
    decode(data: Uint8Array): string;
    encode(data: string): Uint8Array;
  };
}

type DenoNS = typeof Deno & DenoCore;
export const DENO_CORE = (Deno as DenoNS).core;

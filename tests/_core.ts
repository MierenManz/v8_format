interface DenoCore {
  deserialize<T>(data: Uint8Array): T;
  serialize<T>(data: T): Uint8Array;
  decode(data: Uint8Array): string;
  encode(data: string): Uint8Array;
}

// @ts-ignore fuck off
export const DENO_CORE: DenoCore = Deno[Deno.internal].core;

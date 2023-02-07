import { deserializeV8BigInt, serializeJsBigInt } from "../src/bigint.ts";
import { DENO_CORE } from "../tests/_core.ts";

const INPUT = BigInt(Number.MAX_VALUE);

Deno.bench({
  name: "Serialize BigInt (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT);
  },
});

Deno.bench({
  name: "Serialize BigInt (js)",
  group: "Serialize",
  fn: () => {
    serializeJsBigInt(INPUT);
  },
});

Deno.bench({
  name: "Deserialize BigInt (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize BigInt (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT).subarray(2);
    deserializeV8BigInt(buff);
  },
});

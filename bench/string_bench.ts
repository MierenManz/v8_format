import { deserializeV8String, serializeJsString } from "../src/string.ts";
import { DENO_CORE } from "../tests/_core.ts";

const INPUT = "Hello Beautiful World!";
const INPUT2 = "Hello Parking meter 😃";

Deno.bench({
  name: "Serialize String (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT);
  },
});

Deno.bench({
  name: "Serialize String (js)",
  group: "Serialize",
  fn: () => {
    serializeJsString(INPUT);
  },
});

Deno.bench({
  name: "Deserialize String (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize String (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT).subarray(2);
    deserializeV8String(buff);
  },
});

Deno.bench({
  name: "Serialize Two-Byte String (v8)",
  group: "Serialize 2b",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(INPUT2);
  },
});

Deno.bench({
  name: "Serialize Two-Byte String (js)",
  group: "Serialize 2b",
  fn: () => {
    serializeJsString(INPUT2);
  },
});

Deno.bench({
  name: "Deserialize Two-Byte String (v8)",
  group: "Deserialize 2b",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT2);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Two-Byte String (js)",
  group: "Deserialize 2b",
  fn: () => {
    const buff = DENO_CORE.serialize(INPUT2).subarray(2);
    deserializeV8String(buff);
  },
});

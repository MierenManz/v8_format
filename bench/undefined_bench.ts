import {
  deserializeV8Undefined,
  serializeJsUndefined,
} from "../src/undefined.ts";
import { DENO_CORE } from "../tests/_core.ts";

Deno.bench({
  name: "Serialize Undefined (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(undefined);
  },
});

Deno.bench({
  name: "Serialize Undefined (js)",
  group: "Serialize",
  fn: () => {
    serializeJsUndefined(undefined);
  },
});

Deno.bench({
  name: "Deserialize Undefined (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(undefined);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Undefined (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(undefined).subarray(2);
    deserializeV8Undefined(buff);
  },
});

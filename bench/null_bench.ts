import { deserializeV8Null, serializeJsNull } from "../references/null.ts";
import { DENO_CORE } from "../tests/_core.ts";

Deno.bench({
  name: "Serialize Null (v8)",
  group: "Serialize",
  baseline: true,
  fn: () => {
    DENO_CORE.serialize(null);
  },
});
undefined;
Deno.bench({
  name: "Serialize Null (js)",
  group: "Serialize",
  fn: () => {
    serializeJsNull(null);
  },
});

Deno.bench({
  name: "Deserialize Null (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    const buff = DENO_CORE.serialize(null);
    DENO_CORE.deserialize(buff);
  },
});

Deno.bench({
  name: "Deserialize Null (js)",
  group: "Deserialize",
  fn: () => {
    const buff = DENO_CORE.serialize(null).subarray(2);
    deserializeV8Null(buff);
  },
});

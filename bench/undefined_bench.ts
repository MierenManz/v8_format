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

const SERIALIZED_UNDEFINED = DENO_CORE.serialize(undefined);

Deno.bench({
  name: "Deserialize Undefined (v8)",
  group: "Deserialize",
  baseline: true,
  fn: () => {
    DENO_CORE.deserialize(SERIALIZED_UNDEFINED);
  },
});

Deno.bench({
  name: "Deserialize Undefined (js)",
  group: "Deserialize",
  fn: () => {
    deserializeV8Undefined(serializeJsUndefined(undefined));
  },
});

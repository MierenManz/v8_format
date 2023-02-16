import { assertThrows } from "./_deps.ts";
import { deserializeReference } from "../src/object_reference.ts";
import { DENO_CORE } from "./_core.ts";

Deno.test({
  name: "Deserialize reference",
  fn: function () {
    const data = DENO_CORE.serialize(true).subarray(2);
    assertThrows(() => deserializeReference(data, []));
  },
});

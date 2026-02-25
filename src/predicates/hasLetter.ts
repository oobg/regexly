import type { PredicateMeta } from "../types.js";

/** Latin letters (A–Z, a–z) only. */
export function createHasLetter(): PredicateMeta {
  return {
    name: "hasLetter",
    test: (input) => /[A-Za-z]/.test(input),
    patternSource: (opts) => (opts?.i ? "[a-z]" : "[A-Za-z]"),
  };
}

import type { PredicateMeta } from "../types";

export function createHasUppercase(): PredicateMeta {
  return {
    name: "hasUppercase",
    test: (input, opts) => (opts?.i ? /[A-Za-z]/.test(input) : /[A-Z]/.test(input)),
    patternSource: () => "[A-Z]",
  };
}

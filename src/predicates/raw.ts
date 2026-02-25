import type { PredicateMeta } from "../types";

/** Raw regex escape hatch; options (e.g. caseInsensitive) are not applied. */
export function createRaw(re: RegExp): PredicateMeta {
  return {
    name: "raw",
    test: (input) => re.test(input),
  };
}

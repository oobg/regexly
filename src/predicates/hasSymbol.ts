import type { PredicateMeta } from "../types.js";

/** At least one character that is not whitespace, digit, A–Z, a–z, or 가–힣 */
const SYMBOL_PATTERN = "[^\\s\\dA-Za-z가-힣]";

/** At least one character not in whitespace, digit, A–Z, a–z, 가–힣. Non-ASCII scripts count as symbols in MVP. */
export function createHasSymbol(): PredicateMeta {
  return {
    name: "hasSymbol",
    test: (input) => new RegExp(SYMBOL_PATTERN).test(input),
    patternSource: () => SYMBOL_PATTERN,
  };
}

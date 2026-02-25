import type { PredicateMeta } from "../types";
import { LOCALE_PATTERNS } from "../data/lang-pattern";

/**
 * Returns true if input includes at least one character of the given locale's script.
 * Unsupported locale yields false (no throw). Locale is normalized (e.g. "ko-KR" → "ko").
 */
export function createHasLanguage(locale: string): PredicateMeta {
  const normalized = locale.toLowerCase().split("-")[0];
  const pattern = LOCALE_PATTERNS[normalized];
  return {
    name: `hasLanguage(${locale})`,
    test: (input) => {
      if (pattern == null) return false;
      return new RegExp(pattern, "u").test(input);
    },
    patternSource: () => {
      if (pattern == null) return "(?!)"; // never matches so ok() fails
      return pattern;
    },
  };
}

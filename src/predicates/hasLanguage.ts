import type { PredicateMeta } from "../types.js";

const KO_PATTERN = "[가-힣]";

/**
 * MVP: only "ko" (Hangul) is supported. Unsupported locale yields false (no throw).
 */
export function createHasLanguage(locale: string): PredicateMeta {
  const normalized = locale.toLowerCase().split("-")[0];
  return {
    name: `hasLanguage(${locale})`,
    test: (input) => {
      if (normalized !== "ko") return false;
      return new RegExp(KO_PATTERN).test(input);
    },
    patternSource: () => {
      if (normalized !== "ko") return "(?!)"; // never matches so ok() fails
      return KO_PATTERN;
    },
  };
}

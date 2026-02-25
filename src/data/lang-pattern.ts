/**
 * Unicode script patterns for language detection. Use with RegExp `u` flag.
 * Locale codes are normalized to the first segment (e.g. "ko-KR" → "ko").
 */

/** Hangul (Korean) */
export const KO_PATTERN = "\\p{Script=Hangul}";

/** Japanese: Hiragana, Katakana, or Han (Kanji) */
export const JA_PATTERN = "[\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}]";

/** Chinese: Han (CJK unified ideographs) */
export const ZH_PATTERN = "\\p{Script=Han}";

/** Thai */
export const TH_PATTERN = "\\p{Script=Thai}";

/** Arabic */
export const AR_PATTERN = "\\p{Script=Arabic}";

/** Russian etc. (Cyrillic) */
export const CYRILLIC_PATTERN = "\\p{Script=Cyrillic}";

/** Greek */
export const EL_PATTERN = "\\p{Script=Greek}";

/** Hebrew */
export const HE_PATTERN = "\\p{Script=Hebrew}";

/** Locale code (normalized, e.g. "ko") → regex pattern source. */
export const LOCALE_PATTERNS: Record<string, string> = {
  ko: KO_PATTERN,
  ja: JA_PATTERN,
  zh: ZH_PATTERN,
  th: TH_PATTERN,
  ar: AR_PATTERN,
  ru: CYRILLIC_PATTERN,
  el: EL_PATTERN,
  he: HE_PATTERN,
};

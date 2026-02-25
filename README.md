# regexly

Readable string validation without writing regex — chainable predicate API.

## Install

```bash
npm i regexly
```

## Quick start

```ts
import { regexly } from "regexly";

regexly("123cose98").hasNumber().hasLetter().ok(); // true
regexly("ab").hasNumber().hasUppercase().ok();      // false
```

## API (includes semantics)

All checks use **includes** semantics: "does the string contain somewhere (or satisfy) this condition?". There is no full-string match in this API.

| Method | Example |
|--------|---------|
| `hasNumber()` | `regexly("x1").hasNumber().ok()` |
| `hasLetter()` | `regexly("1a").hasLetter().ok()` |
| `hasUppercase()` / `hasLowercase()` | `regexly("Ab").hasUppercase().ok()` |
| `hasLanguage("ko")` | `regexly("한글").hasLanguage("ko").ok()` (MVP: "ko" only) |
| `hasSymbol()` | `regexly("a@").hasSymbol().ok()` |
| `minLength(n)` / `maxLength(n)` | `regexly("abc").minLength(3).ok()` |
| `startsWith(needle)` / `endsWith(needle)` / `includes(needle)` | `regexly("hello").includes("ell").ok()` |
| `raw(re)` | `regexly("123").raw(/\d{3}/).ok()` (options like caseInsensitive do not apply) |
| `caseInsensitive()` | `regexly("ABC").caseInsensitive().hasLetter().ok()` |

End with:

- **`ok()`** or **`test()`** — `true` if all conditions pass (AND).
- **`report()`** — `{ ok, failed: [{ name, message? }], passed: string[] }`.
- **`explain()`** — human-readable summary of what passed/failed.

## report() example

```ts
const r = regexly("ab").hasNumber().hasUppercase().report();
// { ok: false, failed: [{ name: "hasNumber" }, { name: "hasUppercase" }], passed: [] }
```

## explain() example

```ts
regexly("a").hasNumber().hasLetter().explain();
// "Failed: hasNumber. Passed: hasLetter"
```

## Notes

- **Includes semantics**: Only "somewhere" / substring-style checks. No "whole string must match" in this API.
- **raw(re)**: Uses your `RegExp` as-is; `caseInsensitive()` and other options do not apply.
- **hasLetter()**: Latin letters only (A–Z, a–z). For other scripts use `hasLanguage(locale)` (e.g. `hasLanguage("ko")` for Hangul).
- **hasLanguage(locale)**: MVP supports only `"ko"`. **Unsupported locale** (e.g. `"en"`, `"ja"`): always `false`, no error.
- **hasSymbol()**: At least one character that is not whitespace, digit, A–Z, a–z, or Hangul (가–힣). Non-ASCII scripts (Japanese, Chinese, Arabic, etc.) are treated as symbols in MVP; in i18n contexts, "symbol" here includes non-Latin scripts.
- **startsWith(re) / endsWith(re)**: When needle is a `RegExp`, a `^` or `$` anchor is added automatically if not already present. `caseInsensitive()` does not apply to RegExp needles — set the `i` flag directly (e.g. `/hel/i`).
- **minLength(n) / maxLength(n)**: Throws at call time if `n` is negative or non-integer (fail-fast).

## License

[MIT](./LICENSE)

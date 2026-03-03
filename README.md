# oh-my-regex

Readable string validation without writing regex — chainable predicate API.

See [Roadmap](./loadmap.md) for plans and future ideas.

## Install

```bash
npm i oh-my-regex
```

## Quick start

```ts
import { regex } from "oh-my-regex";

regex("123cose98").hasNumber().hasLetter().ok(); // true
regex("ab").hasNumber().hasUppercase().ok();      // false
```

## API (includes semantics)

All checks use **includes** semantics: "does the string contain somewhere (or satisfy) this condition?". There is no full-string match in this API.

| Method | Example |
|--------|---------|
| `hasNumber()` | `regex("x1").hasNumber().ok()` |
| `hasLetter()` | `regex("1a").hasLetter().ok()` |
| `hasUppercase()` / `hasLowercase()` | `regex("Ab").hasUppercase().ok()` |
| `hasLanguage("ko")` | `regex("한글").hasLanguage("ko").ok()` (MVP: "ko" only) |
| `hasSymbol()` | `regex("a@").hasSymbol().ok()` |
| `minLength(n)` / `maxLength(n)` | `regex("abc").minLength(3).ok()` |
| `startsWith(needle)` / `endsWith(needle)` / `includes(needle)` | `regex("hello").includes("ell").ok()` |
| `raw(re)` | `regex("123").raw(/\d{3}/).ok()` (options like caseInsensitive do not apply) |
| `caseInsensitive()` | `regex("ABC").caseInsensitive().hasLetter().ok()` |

End with:

- **`ok()`** or **`test()`** — `true` if all conditions pass (AND).
- **`report()`** — `{ ok, failed: [{ name, message? }], passed: string[] }`.
- **`explain()`** — human-readable summary of what passed/failed.
- **`build(options?)`** — returns the combined `RegExp` from combinable predicates, or `null` when there are none. Options: `{ global?: boolean }` to add the `g` flag. Use `.source` on the result for the pattern string.

## report() example

```ts
const r = regex("ab").hasNumber().hasUppercase().report();
// { ok: false, failed: [{ name: "hasNumber" }, { name: "hasUppercase" }], passed: [] }
```

## explain() example

```ts
regex("a").hasNumber().hasLetter().explain();
// "Failed: hasNumber. Passed: hasLetter"
```

## build() example

```ts
const re = regex("x").hasNumber().hasLetter().build();
// RegExp from combinable predicates; re.test("a1") === true

regex("x").build();                    // null (no combinable predicates)
regex("a1").hasNumber().build({ global: true });  // RegExp with "g" flag
```

## Notes

- **Includes semantics**: Only "somewhere" / substring-style checks. No "whole string must match" in this API.
- **raw(re)**: Uses your `RegExp` as-is; `caseInsensitive()` and other options do not apply. Multiple `raw()` predicates are distinguished in `report().failed` by a short pattern snippet in `name` (e.g. `raw(/\d/)`). Avoid patterns that cause catastrophic backtracking (e.g. nested quantifiers on overlapping alternations); `raw()` runs your RegExp as-is and can block the main thread.
- **hasLetter()**: Latin letters only (A–Z, a–z). For other scripts use `hasLanguage(locale)` (e.g. `hasLanguage("ko")` for Hangul).
- **hasLanguage(locale)**: MVP supports only `"ko"`. **Unsupported locale** (e.g. `"en"`, `"ja"`): always `false`, no error.
- **hasSymbol()**: At least one character that is not whitespace, digit, A–Z, a–z, or Hangul (가–힣). Non-ASCII scripts (Japanese, Chinese, Arabic, etc.) are treated as symbols in MVP; in i18n contexts, "symbol" here includes non-Latin scripts.
- **startsWith(re) / endsWith(re)**: When needle is a `RegExp`, a `^` or `$` anchor is added automatically if not already present. `caseInsensitive()` does not apply to RegExp needles — set the `i` flag directly (e.g. `/hel/i`).
- **minLength(n) / maxLength(n)**: Throws when the predicate is created (at chain build time) if `n` is negative or non-integer (fail-fast).

## License

[MIT](./LICENSE)

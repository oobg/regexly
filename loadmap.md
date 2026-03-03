# Roadmap

This document outlines the direction, principles, and planned evolution of oh-my-regex.

## Introduction

oh-my-regex aims to provide **readable string validation without writing regex**: a chainable predicate API where conditions are named and composable. This roadmap summarizes current principles, external inspiration, planned predicate additions (including color validation), and longer-term API extensions.

## Core Principles

- **Includes semantics**: All checks answer “does the string contain somewhere (or satisfy) this condition?”. There is no full-string match in the current API.
- **ok() / report() / build() consistency**: `ok()` and `report().ok` must always agree. Combinable predicates are merged into one regex for `ok()`; `report()` runs each predicate individually so failure reasons are available. `build()` returns the combined RegExp or null.
- **Framework-agnostic**: Pure functions; no framework or DOM assumptions. Works in Node, browser, Vue, React, SSR, CSR.
- **Tree-shaking**: One export per predicate file; barrel re-exports only; `"sideEffects": false` in package.json.
- **Extensibility**: Predicate/options interfaces are abstracted so new predicates can be added with minimal core changes (one file per predicate, register name + testFn + optional patternSource).

## External Inspiration

| Package | Role | What we take from it |
|--------|------|----------------------|
| [regex](https://www.npmjs.com/package/regex) (slevithan/regex) | Template tag for readable regex with extended syntax (atomic groups, subroutines, interpolation, ReDoS mitigation). | Context-aware interpolation and escaping; safe composition of patterns. oh-my-regex stays focused on “validation without writing regex”; regex is a complementary tool for advanced users who do write regex. Document as a reference only. |
| [char-regex](https://www.npmjs.com/package/char-regex) | Match any full character (Unicode / emoji-aware). | Unicode character boundaries and emoji handling when designing predicates like `hasEmoji()`. Optionally document `raw(charRegex())` as an example for “single character” matching. |

## Short-term Roadmap

- Align README with implementation (e.g. `hasLanguage` supported locales: ko, ja, zh, th, ar, ru, el, he).
- Introduce CHANGELOG and a minimal contributor guide.
- Stabilize tests and lint; lock API semantics before 1.0.
- Add a first color predicate (e.g. `hasHexColor`) as the entry point for color validation.

## Color Predicates

### Semantics

- **Includes-based**: `hasColor()` or format-specific predicates (e.g. `hasHexColor()`, `hasRgbColor()`) mean “the string contains somewhere a valid color expression.” Example: `"background: rgb(0,0,0);"` passes `hasRgbColor()`.
- **Full-string semantics**: A future extension (e.g. “whole string is exactly one valid color”) would be a separate mode or method (e.g. `isColor()`) and is out of scope for the initial color predicates.

### Formats to support

| Format | Examples |
|--------|----------|
| **hex** | `#fff`, `#ffffff`, `#ffff`, `#ffffffff` (3/6/8 digits, case-insensitive) |
| **rgb / rgba** | `rgb(0,0,0)`, `rgba(0,0,0,.5)`, `rgb(0 0 0)`, `rgb(0 0 0 / 0.5)` (comma or space, optional `/ alpha`) |
| **hsl / hsla** | `hsl(0,0%,0%)`, `hsla(0,0%,0%,0.5)`, `hsl(0 0% 0% / 0.5)` |
| **oklch / oklab** | `oklch(0.5 0.2 180)`, `oklch(0.5 0.2 180 / 0.5)`, `oklab(0.5 0.1 0.2 / 0.5)` (CSS Color 4 style, optional alpha) |

Transparency (alpha) is validated as part of each format (e.g. 0–1 or 0%–100% where applicable). Options like `allowAlpha` can be used to require or forbid alpha in the matched format.

### API sketch

- **Unified**: `hasColor(options?)` with e.g. `formats?: ('hex' | 'rgb' | 'hsl' | 'oklch' | 'oklab')[]`, `allowAlpha?: boolean`. Default: all formats, alpha allowed.
- **Format-specific** (good for tree-shaking and explicit intent): `hasHexColor()`, `hasRgbColor()`, `hasHslColor()`, `hasOklchColor()`, `hasOklabColor()`. Optionally a single `hasCssColor()` that accepts any of these.

Implementation should prefer small parser/helper functions for validity (e.g. numeric ranges, slash/alpha parsing) rather than relying on regex alone for every edge case.

## New Predicate Ideas

Ideas are grouped by domain. “Priority” = early candidate for implementation; “Idea” = later or optional.

| Domain | Predicate | Priority / Idea | Notes |
|--------|------------|------------------|--------|
| **Color** | `hasHexColor()`, `hasRgbColor()`, `hasHslColor()`, `hasOklchColor()`, `hasOklabColor()`, or `hasColor(options?)` | Priority | See Color Predicates above. Start with hex, then rgb/hsl, then oklch/oklab. |
| **Unicode / characters** | `hasEmoji()` | Priority | Use char-regex / Unicode ranges for emoji. |
| **Unicode / characters** | `hasWhitespace()`, `hasAscii()`, `hasEmojiOrSymbol()` | Idea | Clarify vs existing `hasSymbol()` and i18n. |
| **Identifiers / text** | `hasEmail()`, `hasUrl()` | Priority | Practical, readable checks; not necessarily spec-perfect. |
| **Identifiers / text** | `hasIpv4()`, `hasIpv6()` | Idea | “String contains a valid-looking address” style; regex package’s IPv4/IPv6 patterns can inform. |
| **Numbers / units** | `hasInteger()`, `hasDecimal()` | Idea | “String contains an integer/decimal number.” |
| **Numbers / units** | `hasCssLength()` | Idea | Contains a CSS length (e.g. `px`, `em`, `rem`, `%`). Useful alongside color for design/forms. |

When adding predicates: one file per predicate, tests for both `ok()` and `report()` consistency, and optional `patternSource` for combinable predicates.

## Future Extensions

These are design memos from the extensibility rules; no commitment to timeline.

| Extension | Description |
|-----------|-------------|
| **anyOf / or** | “Pass if any of these predicates pass.” Requires defining evaluation order and how `report()` represents which branch passed/failed. |
| **not()** | “Pass if this predicate fails.” Needs clear semantics for `report()` (e.g. show as “not(x)” in failed/passed). |
| **matchAll / full-string** | Option or mode where the entire string must satisfy the condition (e.g. “whole string is one valid color”). Would complement current includes-only semantics. |
| **Async validators** | e.g. `hasUsernameAvailable()`. Would require Promise-based chain and terminal methods (`ok()`, `report()`) returning Promises. |

Extension points in types and interfaces should be kept in mind so these can be added without large core changes.

## Priorities & Milestones

| Phase | Scope |
|-------|--------|
| **Short-term (e.g. 0.2.x – 0.3.x)** | README/implementation alignment; CHANGELOG and minimal contributor guide; first color predicate (e.g. `hasHexColor`); test/lint stability. |
| **Mid-term (e.g. 0.4.x – 0.5.x)** | Broader color predicates (rgb, hsl, oklch, oklab); 2–3 more predicates (e.g. `hasEmoji`, `hasUrl`, `hasEmail`) as first-class API. |
| **Long-term (1.0)** | Decide on anyOf/or, not(), full-string mode, async validators; bundle any breaking API changes into 1.0. |

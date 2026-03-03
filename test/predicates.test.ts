import { describe, it, expect } from "vitest";
import { regex } from "../src/index";

describe("hasNumber", () => {
  it("passes when digit present", () => {
    expect(regex("x1").hasNumber().ok()).toBe(true);
    expect(regex("1").hasNumber().ok()).toBe(true);
  });
  it("fails when no digit", () => {
    expect(regex("abc").hasNumber().ok()).toBe(false);
  });
});

describe("hasLetter", () => {
  it("passes when letter present", () => {
    expect(regex("1a").hasLetter().ok()).toBe(true);
    expect(regex("A").hasLetter().ok()).toBe(true);
  });
  it("fails when no letter", () => {
    expect(regex("123").hasLetter().ok()).toBe(false);
  });
});

describe("hasUppercase / hasLowercase", () => {
  it("hasUppercase passes with uppercase", () => {
    expect(regex("Ab").hasUppercase().ok()).toBe(true);
  });
  it("hasLowercase passes with lowercase", () => {
    expect(regex("aB").hasLowercase().ok()).toBe(true);
  });
  it("fails when missing", () => {
    expect(regex("ab").hasUppercase().ok()).toBe(false);
    expect(regex("AB").hasLowercase().ok()).toBe(false);
  });
});

describe("hasLanguage", () => {
  it("ko: passes for Korean", () => {
    expect(regex("한").hasLanguage("ko").ok()).toBe(true);
    expect(regex("한글").hasLanguage("ko").ok()).toBe(true);
  });
  it("ko: fails when no Korean", () => {
    expect(regex("abc").hasLanguage("ko").ok()).toBe(false);
  });
  it("ja: passes for Japanese (Hiragana/Katakana/Han)", () => {
    expect(regex("あ").hasLanguage("ja").ok()).toBe(true);
    expect(regex("カ").hasLanguage("ja").ok()).toBe(true);
    expect(regex("日").hasLanguage("ja").ok()).toBe(true);
  });
  it("zh: passes for Chinese (Han)", () => {
    expect(regex("中").hasLanguage("zh").ok()).toBe(true);
  });
  it("th: passes for Thai", () => {
    expect(regex("ก").hasLanguage("th").ok()).toBe(true);
  });
  it("ar: passes for Arabic", () => {
    expect(regex("ا").hasLanguage("ar").ok()).toBe(true);
  });
  it("ru: passes for Cyrillic", () => {
    expect(regex("а").hasLanguage("ru").ok()).toBe(true);
  });
  it("unsupported locale returns false", () => {
    expect(regex("hello").hasLanguage("xy").ok()).toBe(false);
  });
});

describe("hasSymbol", () => {
  it("fails for letters/digits/space only", () => {
    expect(regex("").hasSymbol().ok()).toBe(false);
    expect(regex("abc").hasSymbol().ok()).toBe(false);
    expect(regex("123").hasSymbol().ok()).toBe(false);
    expect(regex("가나다").hasSymbol().ok()).toBe(false);
    expect(regex("a1가").hasSymbol().ok()).toBe(false);
  });
  it("passes when symbol present", () => {
    expect(regex("a@").hasSymbol().ok()).toBe(true);
    expect(regex("#").hasSymbol().ok()).toBe(true);
    expect(regex("a.b").hasSymbol().ok()).toBe(true);
    expect(regex("()").hasSymbol().ok()).toBe(true);
  });
});

describe("minLength / maxLength", () => {
  it("minLength", () => {
    expect(regex("abc").minLength(3).ok()).toBe(true);
    expect(regex("ab").minLength(3).ok()).toBe(false);
  });
  it("maxLength", () => {
    expect(regex("ab").maxLength(10).ok()).toBe(true);
    expect(regex("abcdefghijk").maxLength(10).ok()).toBe(false);
  });
  it("throws on negative", () => {
    expect(() => regex("x").minLength(-1)).toThrow();
    expect(() => regex("x").maxLength(-1)).toThrow();
  });
});

describe("startsWith / endsWith / includes", () => {
  it("startsWith", () => {
    expect(regex("hello").startsWith("hel").ok()).toBe(true);
    expect(regex("hello").startsWith("ell").ok()).toBe(false);
  });
  it("endsWith", () => {
    expect(regex("hello").endsWith("llo").ok()).toBe(true);
    expect(regex("hello").endsWith("ell").ok()).toBe(false);
  });
  it("includes", () => {
    expect(regex("hello").includes("ell").ok()).toBe(true);
    expect(regex("hello").includes("xyz").ok()).toBe(false);
  });
  it("includes accepts number (coerced to string)", () => {
    expect(regex("a5b").includes(5).ok()).toBe(true);
    expect(regex("abc").includes(5).ok()).toBe(false);
    expect(
      regex("x")
        .includes(5)
        .report()
        .failed.map((f) => f.name),
    ).toContain("includes(5)");
  });
  it("empty needle always passes", () => {
    expect(regex("x").startsWith("").ok()).toBe(true);
    expect(regex("x").endsWith("").ok()).toBe(true);
    expect(regex("x").includes("").ok()).toBe(true);
  });
  it("escapes string needle for regex", () => {
    expect(regex("a.b").startsWith("a.b").ok()).toBe(true);
    expect(regex("a*b").includes("a*b").ok()).toBe(true);
  });
  it("accepts RegExp", () => {
    expect(regex("hello").includes(/l{2}/).ok()).toBe(true);
    expect(regex("file.ts").endsWith(/\.ts$/).ok()).toBe(true);
  });
  it("startsWith(RegExp) auto-anchors: does not match mid-string", () => {
    expect(regex("hello").startsWith(/hel/).ok()).toBe(true);
    expect(regex("xhello").startsWith(/hel/).ok()).toBe(false);
    // already-anchored source must not be double-anchored
    expect(regex("hello").startsWith(/^hel/).ok()).toBe(true);
  });
  it("endsWith(RegExp) auto-anchors: does not match mid-string", () => {
    expect(regex("hello").endsWith(/llo/).ok()).toBe(true);
    expect(regex("hellox").endsWith(/llo/).ok()).toBe(false);
    // already-anchored source must not be double-anchored
    expect(regex("file.ts").endsWith(/\.ts$/).ok()).toBe(true);
  });
});

describe("raw", () => {
  it("uses provided regex as-is", () => {
    expect(regex("123").raw(/\d{3}/).ok()).toBe(true);
    expect(regex("12").raw(/\d{3}/).ok()).toBe(false);
  });
  it("multiple raw() are distinguished in report().failed by pattern snippet in name", () => {
    const r = regex("x").raw(/\d/).raw(/\w/).report();
    expect(r.ok).toBe(false);
    expect(r.failed).toHaveLength(1);
    expect(r.passed).toHaveLength(1);
    const names = r.failed.map((f) => f.name).concat(r.passed);
    expect(names).toContain("raw(/\\d/)");
    expect(names).toContain("raw(/\\w/)");
    expect(names[0]).not.toBe(names[1]);
  });
});

describe("caseInsensitive", () => {
  it("applies to hasLetter", () => {
    expect(regex("ABC").caseInsensitive().hasLetter().ok()).toBe(true);
  });
  it("does not apply to raw", () => {
    expect(
      regex("abc")
        .caseInsensitive()
        .raw(/^[A-Z]+$/)
        .ok(),
    ).toBe(false);
  });
});

describe("ok() vs report() consistency", () => {
  it("same result for combined chain", () => {
    const chain = regex("Ab1!").hasNumber().hasLetter().hasUppercase().hasSymbol();
    expect(chain.ok()).toBe(chain.report().ok);
  });
  it("same result when failing", () => {
    const chain = regex("ab").hasNumber().hasUppercase();
    expect(chain.ok()).toBe(false);
    expect(chain.report().ok).toBe(false);
  });
  it("single-predicate chains: ok() and report().ok agree for each predicate type", () => {
    expect(regex("x1").hasNumber().ok()).toBe(regex("x1").hasNumber().report().ok);
    expect(regex("abc").hasNumber().ok()).toBe(regex("abc").hasNumber().report().ok);
    expect(regex("1a").hasLetter().ok()).toBe(regex("1a").hasLetter().report().ok);
    expect(regex("123").hasLetter().ok()).toBe(regex("123").hasLetter().report().ok);
    expect(regex("Ab").hasUppercase().ok()).toBe(regex("Ab").hasUppercase().report().ok);
    expect(regex("aB").hasLowercase().ok()).toBe(regex("aB").hasLowercase().report().ok);
    expect(regex("한").hasLanguage("ko").ok()).toBe(regex("한").hasLanguage("ko").report().ok);
    expect(regex("abc").hasLanguage("ko").ok()).toBe(
      regex("abc").hasLanguage("ko").report().ok,
    );
    expect(regex("a@").hasSymbol().ok()).toBe(regex("a@").hasSymbol().report().ok);
    expect(regex("abc").hasSymbol().ok()).toBe(regex("abc").hasSymbol().report().ok);
    expect(regex("abc").minLength(3).ok()).toBe(regex("abc").minLength(3).report().ok);
    expect(regex("ab").maxLength(10).ok()).toBe(regex("ab").maxLength(10).report().ok);
    expect(regex("hello").startsWith("hel").ok()).toBe(
      regex("hello").startsWith("hel").report().ok,
    );
    expect(regex("hello").endsWith("llo").ok()).toBe(
      regex("hello").endsWith("llo").report().ok,
    );
    expect(regex("hello").includes("ell").ok()).toBe(
      regex("hello").includes("ell").report().ok,
    );
    expect(regex("123").raw(/\d{3}/).ok()).toBe(regex("123").raw(/\d{3}/).report().ok);
  });
});

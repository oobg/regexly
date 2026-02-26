import { describe, it, expect } from "vitest";
import { regexly } from "../src/index";

describe("hasNumber", () => {
  it("passes when digit present", () => {
    expect(regexly("x1").hasNumber().ok()).toBe(true);
    expect(regexly("1").hasNumber().ok()).toBe(true);
  });
  it("fails when no digit", () => {
    expect(regexly("abc").hasNumber().ok()).toBe(false);
  });
});

describe("hasLetter", () => {
  it("passes when letter present", () => {
    expect(regexly("1a").hasLetter().ok()).toBe(true);
    expect(regexly("A").hasLetter().ok()).toBe(true);
  });
  it("fails when no letter", () => {
    expect(regexly("123").hasLetter().ok()).toBe(false);
  });
});

describe("hasUppercase / hasLowercase", () => {
  it("hasUppercase passes with uppercase", () => {
    expect(regexly("Ab").hasUppercase().ok()).toBe(true);
  });
  it("hasLowercase passes with lowercase", () => {
    expect(regexly("aB").hasLowercase().ok()).toBe(true);
  });
  it("fails when missing", () => {
    expect(regexly("ab").hasUppercase().ok()).toBe(false);
    expect(regexly("AB").hasLowercase().ok()).toBe(false);
  });
});

describe("hasLanguage", () => {
  it("ko: passes for Korean", () => {
    expect(regexly("한").hasLanguage("ko").ok()).toBe(true);
    expect(regexly("한글").hasLanguage("ko").ok()).toBe(true);
  });
  it("ko: fails when no Korean", () => {
    expect(regexly("abc").hasLanguage("ko").ok()).toBe(false);
  });
  it("ja: passes for Japanese (Hiragana/Katakana/Han)", () => {
    expect(regexly("あ").hasLanguage("ja").ok()).toBe(true);
    expect(regexly("カ").hasLanguage("ja").ok()).toBe(true);
    expect(regexly("日").hasLanguage("ja").ok()).toBe(true);
  });
  it("zh: passes for Chinese (Han)", () => {
    expect(regexly("中").hasLanguage("zh").ok()).toBe(true);
  });
  it("th: passes for Thai", () => {
    expect(regexly("ก").hasLanguage("th").ok()).toBe(true);
  });
  it("ar: passes for Arabic", () => {
    expect(regexly("ا").hasLanguage("ar").ok()).toBe(true);
  });
  it("ru: passes for Cyrillic", () => {
    expect(regexly("а").hasLanguage("ru").ok()).toBe(true);
  });
  it("unsupported locale returns false", () => {
    expect(regexly("hello").hasLanguage("xy").ok()).toBe(false);
  });
});

describe("hasSymbol", () => {
  it("fails for letters/digits/space only", () => {
    expect(regexly("").hasSymbol().ok()).toBe(false);
    expect(regexly("abc").hasSymbol().ok()).toBe(false);
    expect(regexly("123").hasSymbol().ok()).toBe(false);
    expect(regexly("가나다").hasSymbol().ok()).toBe(false);
    expect(regexly("a1가").hasSymbol().ok()).toBe(false);
  });
  it("passes when symbol present", () => {
    expect(regexly("a@").hasSymbol().ok()).toBe(true);
    expect(regexly("#").hasSymbol().ok()).toBe(true);
    expect(regexly("a.b").hasSymbol().ok()).toBe(true);
    expect(regexly("()").hasSymbol().ok()).toBe(true);
  });
});

describe("minLength / maxLength", () => {
  it("minLength", () => {
    expect(regexly("abc").minLength(3).ok()).toBe(true);
    expect(regexly("ab").minLength(3).ok()).toBe(false);
  });
  it("maxLength", () => {
    expect(regexly("ab").maxLength(10).ok()).toBe(true);
    expect(regexly("abcdefghijk").maxLength(10).ok()).toBe(false);
  });
  it("throws on negative", () => {
    expect(() => regexly("x").minLength(-1)).toThrow();
    expect(() => regexly("x").maxLength(-1)).toThrow();
  });
});

describe("startsWith / endsWith / includes", () => {
  it("startsWith", () => {
    expect(regexly("hello").startsWith("hel").ok()).toBe(true);
    expect(regexly("hello").startsWith("ell").ok()).toBe(false);
  });
  it("endsWith", () => {
    expect(regexly("hello").endsWith("llo").ok()).toBe(true);
    expect(regexly("hello").endsWith("ell").ok()).toBe(false);
  });
  it("includes", () => {
    expect(regexly("hello").includes("ell").ok()).toBe(true);
    expect(regexly("hello").includes("xyz").ok()).toBe(false);
  });
  it("find (same semantics as includes)", () => {
    expect(regexly("hello").find("ell").ok()).toBe(true);
    expect(regexly("hello").find("xyz").ok()).toBe(false);
    expect(regexly("hello").find(/l{2}/).ok()).toBe(true);
  });
  it("includes and find accept number (coerced to string)", () => {
    expect(regexly("a5b").includes(5).ok()).toBe(true);
    expect(regexly("a5b").find(5).ok()).toBe(true);
    expect(regexly("abc").includes(5).ok()).toBe(false);
    expect(regexly("abc").find(5).ok()).toBe(false);
    expect(regexly("x").find(5).report().failed.map((f) => f.name)).toContain("find(5)");
  });
  it("find appears as find(...) in report", () => {
    const r = regexly("hello").find("ell").report();
    expect(r.ok).toBe(true);
    expect(r.passed).toContain('find("ell")');
    const failed = regexly("hello").find("xyz").report();
    expect(failed.failed).toContainEqual({ name: 'find("xyz")' });
  });
  it("empty needle always passes", () => {
    expect(regexly("x").startsWith("").ok()).toBe(true);
    expect(regexly("x").endsWith("").ok()).toBe(true);
    expect(regexly("x").includes("").ok()).toBe(true);
    expect(regexly("x").find("").ok()).toBe(true);
  });
  it("escapes string needle for regex", () => {
    expect(regexly("a.b").startsWith("a.b").ok()).toBe(true);
    expect(regexly("a*b").includes("a*b").ok()).toBe(true);
  });
  it("accepts RegExp", () => {
    expect(regexly("hello").includes(/l{2}/).ok()).toBe(true);
    expect(regexly("file.ts").endsWith(/\.ts$/).ok()).toBe(true);
  });
  it("startsWith(RegExp) auto-anchors: does not match mid-string", () => {
    expect(regexly("hello").startsWith(/hel/).ok()).toBe(true);
    expect(regexly("xhello").startsWith(/hel/).ok()).toBe(false);
    // already-anchored source must not be double-anchored
    expect(regexly("hello").startsWith(/^hel/).ok()).toBe(true);
  });
  it("endsWith(RegExp) auto-anchors: does not match mid-string", () => {
    expect(regexly("hello").endsWith(/llo/).ok()).toBe(true);
    expect(regexly("hellox").endsWith(/llo/).ok()).toBe(false);
    // already-anchored source must not be double-anchored
    expect(regexly("file.ts").endsWith(/\.ts$/).ok()).toBe(true);
  });
});

describe("raw", () => {
  it("uses provided regex as-is", () => {
    expect(regexly("123").raw(/\d{3}/).ok()).toBe(true);
    expect(regexly("12").raw(/\d{3}/).ok()).toBe(false);
  });
  it("multiple raw() are distinguished in report().failed by pattern snippet in name", () => {
    const r = regexly("x").raw(/\d/).raw(/\w/).report();
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
    expect(regexly("ABC").caseInsensitive().hasLetter().ok()).toBe(true);
  });
  it("does not apply to raw", () => {
    expect(
      regexly("abc")
        .caseInsensitive()
        .raw(/^[A-Z]+$/)
        .ok()
    ).toBe(false);
  });
});

describe("ok() vs report() consistency", () => {
  it("same result for combined chain", () => {
    const chain = regexly("Ab1!").hasNumber().hasLetter().hasUppercase().hasSymbol();
    expect(chain.ok()).toBe(chain.report().ok);
  });
  it("same result when failing", () => {
    const chain = regexly("ab").hasNumber().hasUppercase();
    expect(chain.ok()).toBe(false);
    expect(chain.report().ok).toBe(false);
  });
  it("single-predicate chains: ok() and report().ok agree for each predicate type", () => {
    expect(regexly("x1").hasNumber().ok()).toBe(regexly("x1").hasNumber().report().ok);
    expect(regexly("abc").hasNumber().ok()).toBe(regexly("abc").hasNumber().report().ok);
    expect(regexly("1a").hasLetter().ok()).toBe(regexly("1a").hasLetter().report().ok);
    expect(regexly("123").hasLetter().ok()).toBe(regexly("123").hasLetter().report().ok);
    expect(regexly("Ab").hasUppercase().ok()).toBe(regexly("Ab").hasUppercase().report().ok);
    expect(regexly("aB").hasLowercase().ok()).toBe(regexly("aB").hasLowercase().report().ok);
    expect(regexly("한").hasLanguage("ko").ok()).toBe(regexly("한").hasLanguage("ko").report().ok);
    expect(regexly("abc").hasLanguage("ko").ok()).toBe(
      regexly("abc").hasLanguage("ko").report().ok
    );
    expect(regexly("a@").hasSymbol().ok()).toBe(regexly("a@").hasSymbol().report().ok);
    expect(regexly("abc").hasSymbol().ok()).toBe(regexly("abc").hasSymbol().report().ok);
    expect(regexly("abc").minLength(3).ok()).toBe(regexly("abc").minLength(3).report().ok);
    expect(regexly("ab").maxLength(10).ok()).toBe(regexly("ab").maxLength(10).report().ok);
    expect(regexly("hello").startsWith("hel").ok()).toBe(
      regexly("hello").startsWith("hel").report().ok
    );
    expect(regexly("hello").endsWith("llo").ok()).toBe(
      regexly("hello").endsWith("llo").report().ok
    );
    expect(regexly("hello").includes("ell").ok()).toBe(
      regexly("hello").includes("ell").report().ok
    );
    expect(regexly("hello").find("ell").ok()).toBe(
      regexly("hello").find("ell").report().ok
    );
    expect(regexly("hello").find("xyz").ok()).toBe(
      regexly("hello").find("xyz").report().ok
    );
    expect(regexly("123").raw(/\d{3}/).ok()).toBe(regexly("123").raw(/\d{3}/).report().ok);
  });
});

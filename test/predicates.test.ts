import { describe, it, expect } from "vitest";
import { regexly } from "../src/index.js";

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

describe("hasLanguage(ko)", () => {
  it("passes for Korean", () => {
    expect(regexly("한").hasLanguage("ko").ok()).toBe(true);
    expect(regexly("한글").hasLanguage("ko").ok()).toBe(true);
  });
  it("fails when no Korean", () => {
    expect(regexly("abc").hasLanguage("ko").ok()).toBe(false);
  });
  it("unsupported locale returns false (MVP)", () => {
    expect(regexly("あ").hasLanguage("ja").ok()).toBe(false);
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
  it("empty needle always passes", () => {
    expect(regexly("x").startsWith("").ok()).toBe(true);
    expect(regexly("x").endsWith("").ok()).toBe(true);
    expect(regexly("x").includes("").ok()).toBe(true);
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
});

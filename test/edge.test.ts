import { describe, it, expect } from "vitest";
import { regexly } from "../src/index";

describe("edge cases", () => {
  it("empty string chain", () => {
    expect(regexly("").ok()).toBe(true);
    expect(regexly("").hasNumber().ok()).toBe(false);
  });

  it("AND semantics: all must pass", () => {
    expect(regexly("a1").hasNumber().hasLetter().ok()).toBe(true);
    expect(regexly("a").hasNumber().hasLetter().ok()).toBe(false);
    expect(regexly("1").hasNumber().hasLetter().ok()).toBe(false);
  });

  it("hasLanguage(ko) boundary", () => {
    expect(regexly("가").hasLanguage("ko").ok()).toBe(true);
    expect(regexly("힣").hasLanguage("ko").ok()).toBe(true);
  });

  it("minLength(0) and maxLength(0)", () => {
    expect(regexly("").minLength(0).ok()).toBe(true);
    expect(regexly("").maxLength(0).ok()).toBe(true);
    expect(regexly("x").maxLength(0).ok()).toBe(false);
  });

  it("report failed names", () => {
    const r = regexly("a").hasNumber().hasUppercase().report();
    expect(r.failed.map((f) => f.name)).toContain("hasNumber");
    expect(r.failed.map((f) => f.name)).toContain("hasUppercase");
    expect(r.passed).toHaveLength(0);
  });

  it("startsWith combined with other predicates does not match mid-string", () => {
    // "xhello1" starts with "x", not "hel" — combined regex must not allow (?=.*^hel)
    expect(regexly("xhello1").startsWith("hel").hasNumber().ok()).toBe(false);
    expect(regexly("hello1").startsWith("hel").hasNumber().ok()).toBe(true);
  });

  it("endsWith combined with other predicates does not match mid-string", () => {
    expect(regexly("1hellox").endsWith("llo").hasNumber().ok()).toBe(false);
    expect(regexly("1hello").endsWith("llo").hasNumber().ok()).toBe(true);
  });
});

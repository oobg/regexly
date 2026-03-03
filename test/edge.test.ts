import { describe, it, expect } from "vitest";
import { regex } from "../src/index";

describe("edge cases", () => {
  it("empty string chain", () => {
    expect(regex("").ok()).toBe(true);
    expect(regex("").hasNumber().ok()).toBe(false);
  });

  it("AND semantics: all must pass", () => {
    expect(regex("a1").hasNumber().hasLetter().ok()).toBe(true);
    expect(regex("a").hasNumber().hasLetter().ok()).toBe(false);
    expect(regex("1").hasNumber().hasLetter().ok()).toBe(false);
  });

  it("hasLanguage(ko) boundary", () => {
    expect(regex("가").hasLanguage("ko").ok()).toBe(true);
    expect(regex("힣").hasLanguage("ko").ok()).toBe(true);
  });

  it("minLength(0) and maxLength(0)", () => {
    expect(regex("").minLength(0).ok()).toBe(true);
    expect(regex("").maxLength(0).ok()).toBe(true);
    expect(regex("x").maxLength(0).ok()).toBe(false);
  });

  it("report failed names", () => {
    const r = regex("a").hasNumber().hasUppercase().report();
    expect(r.failed.map((f) => f.name)).toContain("hasNumber");
    expect(r.failed.map((f) => f.name)).toContain("hasUppercase");
    expect(r.passed).toHaveLength(0);
  });

  it("startsWith combined with other predicates does not match mid-string", () => {
    // "xhello1" starts with "x", not "hel" — combined regex must not allow (?=.*^hel)
    expect(regex("xhello1").startsWith("hel").hasNumber().ok()).toBe(false);
    expect(regex("hello1").startsWith("hel").hasNumber().ok()).toBe(true);
  });

  it("endsWith combined with other predicates does not match mid-string", () => {
    expect(regex("1hellox").endsWith("llo").hasNumber().ok()).toBe(false);
    expect(regex("1hello").endsWith("llo").hasNumber().ok()).toBe(true);
  });
});

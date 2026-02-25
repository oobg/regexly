import { describe, it, expect } from "vitest";
import { regexly } from "../src/index";

describe("regexly entry point", () => {
  it("returns chain that can call ok(), report(), explain()", () => {
    const chain = regexly("");
    expect(chain.ok()).toBe(true);
    expect(chain.report().ok).toBe(true);
    expect(typeof chain.explain()).toBe("string");
  });

  it("test() is alias of ok()", () => {
    const chain = regexly("a1").hasNumber().hasLetter();
    expect(chain.ok()).toBe(chain.test());
  });

  it("ok() and report().ok match", () => {
    const chain = regexly("ab").hasNumber().hasUppercase();
    expect(chain.ok()).toBe(false);
    expect(chain.report().ok).toBe(false);
    expect(chain.ok()).toBe(chain.report().ok);
  });

  it("report() returns passed and failed names", () => {
    const r = regexly("aB1").hasNumber().hasLetter().hasUppercase().report();
    expect(r.ok).toBe(true);
    expect(r.passed).toContain("hasNumber");
    expect(r.passed).toContain("hasLetter");
    expect(r.passed).toContain("hasUppercase");
    expect(r.failed).toHaveLength(0);
  });

  it("explain() reflects report", () => {
    const chain = regexly("a").hasNumber().hasLetter();
    const r = chain.report();
    expect(r.ok).toBe(false);
    const expl = chain.explain();
    expect(expl).toContain("Failed");
    expect(expl).toContain("hasNumber");
  });

  it("throws on non-string input", () => {
    expect(() => (regexly as (x: unknown) => unknown)(null)).toThrow(TypeError);
    expect(() => (regexly as (x: unknown) => unknown)(undefined)).toThrow(TypeError);
    expect(() => (regexly as (x: unknown) => unknown)(123)).toThrow(TypeError);
  });
});

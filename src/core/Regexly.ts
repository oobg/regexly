import type { ChainOptions, PredicateMeta, Report } from "../types";
import {
  createHasNumber,
  createHasLetter,
  createHasUppercase,
  createHasLowercase,
  createHasLanguage,
  createHasSymbol,
  createMinLength,
  createMaxLength,
  createStartsWith,
  createEndsWith,
  createIncludes,
  createRaw,
} from "../predicates/index";

export class Regexly {
  private readonly input: string;
  private options: ChainOptions = {};
  private readonly predicates: PredicateMeta[] = [];

  constructor(input: string) {
    if (typeof input !== "string") {
      throw new TypeError("regexly() expects a string");
    }
    this.input = input;
  }

  private addPredicate(meta: PredicateMeta): this {
    this.predicates.push(meta);
    return this;
  }

  hasNumber(): this {
    return this.addPredicate(createHasNumber());
  }

  hasLetter(): this {
    return this.addPredicate(createHasLetter());
  }

  hasUppercase(): this {
    return this.addPredicate(createHasUppercase());
  }

  hasLowercase(): this {
    return this.addPredicate(createHasLowercase());
  }

  hasLanguage(locale: string): this {
    return this.addPredicate(createHasLanguage(locale));
  }

  hasSymbol(): this {
    return this.addPredicate(createHasSymbol());
  }

  minLength(n: number): this {
    return this.addPredicate(createMinLength(n));
  }

  maxLength(n: number): this {
    return this.addPredicate(createMaxLength(n));
  }

  startsWith(needle: string | RegExp): this {
    return this.addPredicate(createStartsWith(needle));
  }

  endsWith(needle: string | RegExp): this {
    return this.addPredicate(createEndsWith(needle));
  }

  includes(needle: string | RegExp): this {
    return this.addPredicate(createIncludes(needle));
  }

  raw(re: RegExp): this {
    return this.addPredicate(createRaw(re));
  }

  caseInsensitive(): this {
    this.options = { ...this.options, i: true };
    return this;
  }

  private buildCombinedRegex(): RegExp | null {
    const parts: string[] = [];
    for (const p of this.predicates) {
      if (p.patternSource) {
        const fragment = p.patternSource(this.options);
        if (fragment !== "") {
          // Fragments anchored at ^ must not be prefixed with .* inside the lookahead;
          // the outer ^ already places evaluation at position 0.
          const lookahead = fragment.startsWith("^") ? `(?=${fragment})` : `(?=.*${fragment})`;
          parts.push(lookahead);
        }
      }
    }
    if (parts.length === 0) return null;
    const flags = this.options?.i ? "si" : "s";
    return new RegExp(`^${parts.join("")}.*$`, flags);
  }

  ok(): boolean {
    for (const p of this.predicates) {
      if (!p.patternSource) {
        if (!p.test(this.input, this.options)) return false;
      }
    }
    const combined = this.buildCombinedRegex();
    if (combined && !combined.test(this.input)) return false;
    return true;
  }

  test(): boolean {
    return this.ok();
  }

  report(): Report {
    const passed: string[] = [];
    const failed: Array<{ name: string; message?: string }> = [];
    for (const p of this.predicates) {
      if (p.test(this.input, this.options)) {
        passed.push(p.name);
      } else {
        failed.push({ name: p.name });
      }
    }
    return {
      ok: failed.length === 0,
      failed,
      passed,
    };
  }

  explain(): string {
    const r = this.report();
    if (r.ok) {
      return "All checks passed: " + r.passed.join(", ");
    }
    const failedList = r.failed.map((f) => f.name).join(", ");
    return `Failed: ${failedList}. Passed: ${r.passed.join(", ") || "(none)"}`;
  }
}

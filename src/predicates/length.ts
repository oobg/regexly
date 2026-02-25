import type { PredicateMeta } from "../types";

export function createMinLength(n: number): PredicateMeta {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("minLength requires a non-negative integer");
  }
  return {
    name: `minLength(${n})`,
    test: (input) => input.length >= n,
  };
}

export function createMaxLength(n: number): PredicateMeta {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("maxLength requires a non-negative integer");
  }
  return {
    name: `maxLength(${n})`,
    test: (input) => input.length <= n,
  };
}

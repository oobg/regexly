import { Regexly } from "./core/Regexly.js";

export type { Report } from "./types.js";
export type { Regexly } from "./core/Regexly.js";

/**
 * Create a chainable validator for the given string (includes semantics: "somewhere" matches).
 */
export function regexly(input: string): Regexly {
  return new Regexly(input);
}

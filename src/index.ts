import { Regexly } from "./core/Regexly";

export type { Report } from "./types";
export type { Regexly } from "./core/Regexly";

/**
 * Create a chainable validator for the given string (includes semantics: "somewhere" matches).
 */
export function regexly(input: string): Regexly {
  return new Regexly(input);
}

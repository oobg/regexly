import { Regex } from "./core/Regex";

export type { BuildOptions, Report } from "./types";
export type { Regex } from "./core/Regex";

/**
 * Create a chainable validator for the given string (includes semantics: "somewhere" matches).
 */
export function regex(input: string): Regex {
  return new Regex(input);
}

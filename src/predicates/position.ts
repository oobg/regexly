import type { ChainOptions, PredicateMeta } from "../types";
import { escapeForRegex } from "../utils/escape";

function buildPositionPredicate(
  name: string,
  testFn: (input: string, options?: ChainOptions) => boolean,
  patternFragment: string | null,
): PredicateMeta {
  return {
    name,
    test: testFn,
    ...(patternFragment !== null && {
      patternSource: () => patternFragment,
    }),
  };
}

/**
 * Force a ^ anchor on a RegExp needle so startsWith semantics hold.
 * If the source already starts with ^, return as-is to avoid double-anchoring.
 * caseInsensitive() does not apply to RegExp needles; users control flags directly.
 */
function anchorStart(re: RegExp): RegExp {
  if (re.source.startsWith("^")) return re;
  return new RegExp(`^(?:${re.source})`, re.flags);
}

/**
 * Force a $ anchor on a RegExp needle so endsWith semantics hold.
 * If the source already ends with $, return as-is to avoid double-anchoring.
 * caseInsensitive() does not apply to RegExp needles; users control flags directly.
 */
function anchorEnd(re: RegExp): RegExp {
  if (re.source.endsWith("$")) return re;
  return new RegExp(`(?:${re.source})$`, re.flags);
}

export function createStartsWith(needle: string | RegExp): PredicateMeta {
  return buildPositionPredicate(
    `startsWith(${needle instanceof RegExp ? needle.source : JSON.stringify(needle)})`,
    (input, opts) => {
      if (typeof needle === "string") {
        if (needle === "") return true;
        return new RegExp(`^${escapeForRegex(needle)}`, opts?.i ? "i" : "").test(input);
      }
      return anchorStart(needle).test(input);
    },
    typeof needle === "string" ? (needle === "" ? "" : `^${escapeForRegex(needle)}`) : null,
  );
}

export function createEndsWith(needle: string | RegExp): PredicateMeta {
  return buildPositionPredicate(
    `endsWith(${needle instanceof RegExp ? needle.source : JSON.stringify(needle)})`,
    (input, opts) => {
      if (typeof needle === "string") {
        if (needle === "") return true;
        return new RegExp(`${escapeForRegex(needle)}$`, opts?.i ? "i" : "").test(input);
      }
      return anchorEnd(needle).test(input);
    },
    typeof needle === "string" ? (needle === "" ? "" : `${escapeForRegex(needle)}$`) : null,
  );
}

export function createIncludes(needle: string | number | RegExp): PredicateMeta {
  const effective = typeof needle === "number" ? String(needle) : needle;
  const name = `includes(${effective instanceof RegExp ? effective.source : JSON.stringify(needle)})`;
  return buildPositionPredicate(
    name,
    (input, opts) => {
      if (typeof effective === "string" && effective === "") return true;
      const re =
        effective instanceof RegExp
          ? effective
          : new RegExp(escapeForRegex(effective), opts?.i ? "i" : "");
      return re.test(input);
    },
    typeof effective === "string" ? (effective === "" ? "" : escapeForRegex(effective)) : null,
  );
}

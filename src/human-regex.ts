// human-regex.ts
// Static cache for escaped literals
const escapeCache = new Map<string, string>();

/**
 * Regex flags (optimized as Set-based)
 */
const Flags = {
  GLOBAL: "g",
  NON_SENSITIVE: "i",
  MULTILINE: "m",
  DOT_ALL: "s",
  UNICODE: "u",
  STICKY: "y",
} as const;

/**
 * Precomputed character ranges
 */
const Ranges = Object.freeze({
  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",
});

type RangeKeys = keyof typeof Ranges;

/**
 * Quantifier symbols
 */
const Quantifiers = Object.freeze({
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
});

class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor() {
    this.parts = [];
    this.flags = new Set<string>();
  }

  // Core components
  digit(): this {
    return this.add("\\d");
  }

  special(): this {
    return this.add("(?=.*[!@#$%^&*])");
  }

  word(): this {
    return this.add("\\w");
  }

  whitespace(): this {
    return this.add("\\s");
  }

  literal(text: string): this {
    return this.add(escapeLiteral(text));
  }

  or(): this {
    return this.add("|");
  }

  range(name: RangeKeys): this {
    const range = Ranges[name];
    if (!range) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${range}]`);
  }

  letter(): this {
    return this.add("[a-zA-Z]");
  }

  anyCharacter(): this {
    return this.add(".");
  }

  // Lookaheads for validation
  hasSpecialCharacter(): this {
    return this.add("(?=.*[!@#$%^&*])");
  }

  hasDigit(): this {
    return this.add("(?=.*\\d)");
  }

  hasLetter(): this {
    return this.add("(?=.*[a-zA-Z])");
  }

  // Quantifiers
  exactly(n: number): this {
    return this.add(`{${n}}`);
  }

  atLeast(n: number): this {
    return this.add(`{${n},}`);
  }

  atMost(n: number): this {
    return this.add(`{0,${n}}`);
  }

  between(min: number, max: number): this {
    return this.add(`{${min},${max}}`);
  }

  oneOrMore(): this {
    return this.add(Quantifiers.oneOrMore);
  }

  optional(): this {
    return this.add(Quantifiers.optional);
  }

  zeroOrMore(): this {
    return this.add(Quantifiers.zeroOrMore);
  }

  // Grouping and anchors
  startGroup(): this {
    return this.add("(?:");
  }

  endGroup(): this {
    return this.add(")");
  }

  startAnchor(): this {
    return this.add("^");
  }

  endAnchor(): this {
    return this.add("$");
  }

  // Flags (optimized string operations)
  global(): this {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  nonSensitive(): this {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  // Protocol optimization using optional 's'
  protocol(): this {
    return this.add("https?://");
  }

  www(): this {
    return this.add("(www\\.)?");
  }

  tld(): this {
    return this.add("(com|org|net)");
  }

  path(): this {
    return this.add("(/\\w+)*");
  }

  // Internal methods
  private add(part: string): this {
    this.parts.push(part);
    return this;
  }

  toString(): string {
    return this.parts.join("");
  }

  toRegExp(): RegExp {
    const pattern = this.toString();
    return new RegExp(pattern, [...this.flags].join(""));
  }
}

function escapeLiteral(text: string): string {
  if (!escapeCache.has(text)) {
    escapeCache.set(text, text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  }
  return escapeCache.get(text) as string;
}

/**
 * Memoized predefined patterns
 */
const createRegex = (): HumanRegex => new HumanRegex();

const Patterns = (() => {
  const createCachedPattern = (builder: () => HumanRegex): (() => RegExp) => {
    const regex = builder().toRegExp();
    return () => regex;
  };

  return {
    email: createCachedPattern(() =>
      createRegex()
        .startAnchor()
        .word()
        .oneOrMore()
        .literal("@")
        .word()
        .oneOrMore()
        .startGroup()
        .literal(".")
        .word()
        .oneOrMore()
        .endGroup()
        .zeroOrMore()
        .literal(".")
        .letter()
        .atLeast(2)
        .endAnchor()
    ),
    url: createCachedPattern(() =>
      createRegex()
        .startAnchor()
        .protocol()
        .optional()
        .www()
        .word()
        .oneOrMore()
        .literal(".")
        .tld()
        .path()
        .optional()
        .endAnchor()
    ),
    phoneInternational: createCachedPattern(() =>
      createRegex()
        .startAnchor()
        .literal("+")
        .digit()
        .between(1, 3)
        .literal("-")
        .digit()
        .between(3, 14)
        .endAnchor()
    ),
  };
})();

// Public API
export { createRegex, Patterns, Flags, Ranges, Quantifiers };

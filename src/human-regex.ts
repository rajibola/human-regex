/**
 * @module human-regex
 * A utility for building regular expressions with a human-readable syntax.
 */

/** Static cache for escaped literals */
const escapeCache = new Map<string, string>();

/** Regular expression flags */
const Flags = {
  /** Global match */
  GLOBAL: "g",
  /** Case-insensitive matching */
  NON_SENSITIVE: "i",
  /** Multi-line matching */
  MULTILINE: "m",
  /** Dot matches newlines */
  DOT_ALL: "s",
  /** Enable Unicode features */
  UNICODE: "u",
  /** Sticky matching */
  STICKY: "y",
} as const;

/** Predefined character ranges */
const Ranges = Object.freeze({
  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",
});

type RangeKeys = keyof typeof Ranges;

/** Regular expression quantifiers */
const Quantifiers = Object.freeze({
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
});

/**
 * Class for building regular expressions using a chainable API
 * @class
 */
class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor() {
    this.parts = [];
    this.flags = new Set<string>();
  }

  // Basic character types
  /** Matches any digit (0-9) */
  digit(): this {
    return this.add("\\d");
  }

  /** Positive lookahead for special characters */
  special(): this {
    return this.add("(?=.*[!@#$%^&*])");
  }

  /** Matches any word character (a-z, A-Z, 0-9, and _) */
  word(): this {
    return this.add("\\w");
  }

  /** Matches any whitespace character */
  whitespace(): this {
    return this.add("\\s");
  }

  /** Matches any non-whitespace character */
  nonWhitespace(): this {
    return this.add("\\S");
  }

  /** Escapes and matches a literal string */
  literal(text: string): this {
    return this.add(escapeLiteral(text));
  }

  /** Alternation operator (OR) */
  or(): this {
    return this.add("|");
  }

  /** Matches any character in a predefined range */
  range(name: RangeKeys): this {
    const range = Ranges[name];
    if (!range) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${range}]`);
  }

  /** Matches any character not in the specified set */
  notRange(chars: string): this {
    return this.add(`[^${chars}]`);
  }

  /** Makes the previous quantifier lazy */
  lazy(): this {
    const lastPart = this.parts.pop();
    if (!lastPart) throw new Error("No quantifier to make lazy");
    return this.add(`${lastPart}?`);
  }

  // Grouping constructs
  /** Starts a named capturing group */
  startNamedGroup(name: string): this {
    return this.add(`(?<${name}>`);
  }

  /** Matches any uppercase or lowercase letter */
  letter(): this {
    return this.add("[a-zA-Z]");
  }

  /** Matches any character except newlines */
  anyCharacter(): this {
    return this.add(".");
  }

  // Lookaround assertions
  /** Negative lookahead assertion */
  negativeLookahead(pattern: string): this {
    return this.add(`(?!${pattern})`);
  }

  /** Positive lookahead assertion */
  positiveLookahead(pattern: string): this {
    return this.add(`(?=${pattern})`);
  }

  /** Positive lookbehind assertion */
  positiveLookbehind(pattern: string): this {
    return this.add(`(?<=${pattern})`);
  }

  /** Negative lookbehind assertion */
  negativeLookbehind(pattern: string): this {
    return this.add(`(?<!${pattern})`);
  }

  // Validation helpers
  /** Positive lookahead for special characters */
  hasSpecialCharacter(): this {
    return this.add("(?=.*[!@#$%^&*])");
  }

  /** Positive lookahead for digits */
  hasDigit(): this {
    return this.add("(?=.*\\d)");
  }

  /** Positive lookahead for letters */
  hasLetter(): this {
    return this.add("(?=.*[a-zA-Z])");
  }

  // Quantifiers
  /** Matches exactly n occurrences */
  exactly(n: number): this {
    return this.add(`{${n}}`);
  }

  /** Matches at least n occurrences */
  atLeast(n: number): this {
    return this.add(`{${n},}`);
  }

  /** Matches at most n occurrences */
  atMost(n: number): this {
    return this.add(`{0,${n}}`);
  }

  /** Matches between min and max occurrences */
  between(min: number, max: number): this {
    return this.add(`{${min},${max}}`);
  }

  /** Matches one or more occurrences */
  oneOrMore(): this {
    return this.add(Quantifiers.oneOrMore);
  }

  /** Matches zero or one occurrences */
  optional(): this {
    return this.add(Quantifiers.optional);
  }

  /** Matches zero or more occurrences */
  zeroOrMore(): this {
    return this.add(Quantifiers.zeroOrMore);
  }

  // Anchors and boundaries
  /** Starts a non-capturing group */
  startGroup(): this {
    return this.add("(?:");
  }

  /** Starts a capturing group */
  startCaptureGroup(): this {
    return this.add("(");
  }

  /** Word boundary assertion */
  wordBoundary(): this {
    return this.add("\\b");
  }

  /** Non-word boundary assertion */
  nonWordBoundary(): this {
    return this.add("\\B");
  }

  /** Ends the current group */
  endGroup(): this {
    return this.add(")");
  }

  /** Start of string/line anchor */
  startAnchor(): this {
    return this.add("^");
  }

  /** End of string/line anchor */
  endAnchor(): this {
    return this.add("$");
  }

  // Flag management
  /** Adds global match flag */
  global(): this {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  /** Adds case-insensitive match flag */
  nonSensitive(): this {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  /** Adds multiline match flag */
  multiline(): this {
    this.flags.add(Flags.MULTILINE);
    return this;
  }

  /** Adds dot-all match flag */
  dotAll(): this {
    this.flags.add(Flags.DOT_ALL);
    return this;
  }

  /** Adds sticky match flag */
  sticky(): this {
    this.flags.add(Flags.STICKY);
    return this;
  }

  // Unicode properties
  /** Matches Unicode characters */
  unicodeChar(variant?: "u" | "l" | "t" | "m" | "o"): this {
    this.flags.add(Flags.UNICODE);
    const validVariants = new Set(["u", "l", "t", "m", "o"] as const);

    if (variant !== undefined && !validVariants.has(variant)) {
      throw new Error(`Invalid Unicode letter variant: ${variant}`);
    }

    return this.add(`\\p{L${variant ?? ""}}`);
  }

  /** Matches Unicode digits */
  unicodeDigit(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{N}");
  }

  /** Matches Unicode punctuation */
  unicodePunctuation(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{P}");
  }

  /** Matches Unicode symbols */
  unicodeSymbol(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{S}");
  }

  // Complex patterns
  /** Repeats the previous pattern exactly count times */
  repeat(count: number): this {
    if (this.parts.length === 0) {
      throw new Error("No pattern to repeat");
    }

    const lastPart = this.parts.pop();
    this.parts.push(`(${lastPart}){${count}}`);
    return this;
  }

  /** Matches an IPv4 octet */
  ipv4Octet(): this {
    return this.add("(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)");
  }

  /** Matches URL protocol */
  protocol(): this {
    return this.add("https?://");
  }

  /** Matches optional www subdomain */
  www(): this {
    return this.add("(www\\.)?");
  }

  /** Matches common TLDs */
  tld(): this {
    return this.add("(com|org|net)");
  }

  /** Matches URL path segments */
  path(): this {
    return this.add("(/\\w+)*");
  }

  // Internal utilities
  private add(part: string): this {
    this.parts.push(part);
    return this;
  }

  /** Returns the constructed pattern string */
  toString(): string {
    return this.parts.join("");
  }

  /** Compiles the pattern to a RegExp object */
  toRegExp(): RegExp {
    return new RegExp(this.toString(), [...this.flags].join(""));
  }
}

/** Escapes special characters in a literal string */
function escapeLiteral(text: string): string {
  if (!escapeCache.has(text)) {
    escapeCache.set(text, text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  }
  return escapeCache.get(text)!;
}

/** Factory function for creating HumanRegex instances */
const createRegex = (): HumanRegex => new HumanRegex();

/** Predefined common pattern templates */
const Patterns = (() => {
  const createCachedPattern = (builder: () => HumanRegex) => {
    const regex = builder().toRegExp();
    return () => new RegExp(regex.source, regex.flags);
  };

  return {
    /** Email address pattern */
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
    /** URL pattern */
    url: createCachedPattern(() =>
      createRegex()
        .startAnchor()
        .protocol()
        .www()
        .word()
        .oneOrMore()
        .literal(".")
        .tld()
        .path()
        .endAnchor()
    ),
    /** International phone number pattern */
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

export { createRegex, Patterns, Flags, Ranges, Quantifiers };

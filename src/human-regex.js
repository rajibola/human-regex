// human-regex.js
// Static cache for escaped literals
const escapeCache = new Map();

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
};

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

/**
 * Quantifier symbols
 */
const Quantifiers = Object.freeze({
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
});

class HumanRegex {
  constructor() {
    this.parts = [];
    this.flags = new Set(); // Use a Set for unique flags
  }

  // Core components
  digit() {
    return this.add("\\d");
  }

  word() {
    return this.add("\\w");
  }

  whitespace() {
    return this.add("\\s");
  }

  literal(text) {
    return this.add(escapeLiteral(text));
  }

  or() {
    return this.add("|");
  }

  range(name) {
    const range = Ranges[name];
    if (!range) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${range}]`);
  }

  letter() {
    return this.add("[a-zA-Z]");
  }

  // Quantifiers
  exactly(n) {
    return this.add(`{${n}}`);
  }

  atLeast(n) {
    return this.add(`{${n},}`);
  }

  between(min, max) {
    return this.add(`{${min},${max}}`);
  }

  oneOrMore() {
    return this.add(Quantifiers.oneOrMore);
  }

  optional() {
    return this.add(Quantifiers.optional);
  }

  zeroOrMore() {
    return this.add(Quantifiers.zeroOrMore);
  }

  // Grouping and anchors
  startGroup() {
    return this.add("(?:");
  }

  endGroup() {
    return this.add(")");
  }

  startAnchor() {
    return this.add("^");
  }

  endAnchor() {
    return this.add("$");
  }

  // Flags (optimized string operations)
  global() {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  nonSensitive() {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  // Protocol optimization using optional 's'
  protocol() {
    return this.add("https?://");
  }

  www() {
    return this.add("(www\\.)?");
  }

  tld() {
    return this.add("(com|org|net)");
  }

  path() {
    return this.add("(/\\w+)*");
  }

  // Internal methods
  add(part) {
    this.parts.push(part);
    return this;
  }

  toString() {
    return this.parts.join("");
  }

  toRegExp() {
    // Reuse regex instances when possible
    const pattern = this.toString();
    return new RegExp(pattern, [...this.flags].join(""));
  }
}

function escapeLiteral(text) {
  if (!escapeCache.has(text)) {
    escapeCache.set(text, text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  }
  return escapeCache.get(text);
}

/**
 * Memoized predefined patterns
 */
const createRegex = () => new HumanRegex();

// Define Patterns after createRegex is initialized
const Patterns = (() => {
  const createCachedPattern = (builder) => {
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
Object.assign(createRegex, { Patterns, Flags, Ranges, Quantifiers });
module.exports = createRegex;

// human-regex.js

/**
 * Regex flags
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
 * Character ranges
 */
const Ranges = {
  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",
};

/**
 * Quantifiers
 */
const Quantifiers = {
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
};

/**
 * Predefined patterns
 */
const Patterns = {
  email: () =>
    createRegex()
      .word()
      .oneOrMore()
      .literal("@")
      .word()
      .oneOrMore()
      .literal(".")
      .letter()
      .atLeast(2),
  phoneUS: () => createRegex().literal("\\d{3}-\\d{3}-\\d{4}"),
  url: () =>
    createRegex()
      .startAnchor()
      .startGroup()
      .protocol()
      .endGroup()
      .optional()
      .www()
      .word()
      .oneOrMore()
      .literal(".")
      .tld()
      .path()
      .endAnchor()
      .toRegExp(),
};

/**
 * Human-friendly regex builder class
 */
class HumanRegex {
  constructor() {
    this.parts = [];
    this.flags = new Set();
  }

  /**
   * Adds a digit pattern
   * @returns {HumanRegex}
   */
  digit() {
    return this.add("\\d");
  }

  /**
   * Adds a word character pattern
   * @returns {HumanRegex}
   */
  word() {
    return this.add("\\w");
  }

  /**
   * Adds a whitespace character pattern
   * @returns {HumanRegex}
   */
  whitespace() {
    return this.add("\\s");
  }

  /**
   * Adds a literal text pattern
   * @param {string} text
   * @returns {HumanRegex}
   */
  literal(text) {
    return this.add(this.escapeRegExp(text));
  }

  /**
   * Adds a character range pattern
   * @param {string} name
   * @returns {HumanRegex}
   */
  range(name) {
    if (!Ranges[name]) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${Ranges[name]}]`);
  }

  /**
   * Adds a letter character pattern
   * @returns {HumanRegex}
   */
  letter() {
    return this.add("[a-zA-Z]");
  }

  /**
   * Adds an optional quantifier
   * @returns {HumanRegex}
   */
  optional() {
    return this.add(Quantifiers.optional);
  }

  /**
   * Starts a non-capturing group
   * @returns {HumanRegex}
   */
  startGroup() {
    return this.add("(?:");
  }

  /**
   * Ends a non-capturing group
   * @returns {HumanRegex}
   */
  endGroup() {
    return this.add(")");
  }

  /**
   * Adds a start anchor
   * @returns {HumanRegex}
   */
  startAnchor() {
    return this.add("^");
  }

  /**
   * Adds an end anchor
   * @returns {HumanRegex}
   */
  endAnchor() {
    return this.add("$");
  }

  /**
   * Adds an exact quantifier
   * @param {number} n
   * @returns {HumanRegex}
   */
  exactly(n) {
    return this.add(`{${n}}`);
  }

  /**
   * Adds an at least quantifier
   * @param {number} n
   * @returns {HumanRegex}
   */
  atLeast(n) {
    return this.add(`{${n},}`);
  }

  /**
   * Adds a between quantifier
   * @param {number} min
   * @param {number} max
   * @returns {HumanRegex}
   */
  between(min, max) {
    return this.add(`{${min},${max}}`);
  }

  /**
   * Adds a one or more quantifier
   * @returns {HumanRegex}
   */
  oneOrMore() {
    return this.add("+");
  }

  /**
   * Adds the global flag
   * @returns {HumanRegex}
   */
  global() {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  /**
   * Adds the case-insensitive flag
   * @returns {HumanRegex}
   */
  nonSensitive() {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  /**
   * Adds a protocol pattern
   * @returns {HumanRegex}
   */
  protocol() {
    return this.add("(http|https)://");
  }

  /**
   * Adds a www pattern
   * @returns {HumanRegex}
   */
  www() {
    return this.add("(www\\.)?");
  }

  /**
   * Adds a top-level domain pattern
   * @returns {HumanRegex}
   */
  tld() {
    return this.add("(com|org|net)");
  }

  /**
   * Adds a path pattern
   * @returns {HumanRegex}
   */
  path() {
    return this.add("(/\\w+)*");
  }

  /**
   * Adds a part to the regex
   * @param {string} part
   * @returns {HumanRegex}
   */
  add(part) {
    this.parts.push(part);
    return this;
  }

  /**
   * Converts the regex to a string
   * @returns {string}
   */
  toString() {
    return this.parts.join("");
  }

  /**
   * Converts the regex to a RegExp object
   * @returns {RegExp}
   */
  toRegExp() {
    return new RegExp(this.toString(), Array.from(this.flags).join(""));
  }

  /**
   * Escapes special characters in a string for use in a regex
   * @param {string} text
   * @returns {string}
   */
  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

// Public API
const createRegex = () => new HumanRegex();
Object.assign(createRegex, { Patterns, Flags, Ranges, Quantifiers });

module.exports = createRegex;

// human-regex.js

const Flags = {
  GLOBAL: "g",
  NON_SENSITIVE: "i",
  MULTILINE: "m",
  DOT_ALL: "s",
  UNICODE: "u",
  STICKY: "y",
};

const Ranges = {
  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",
};

const Quantifiers = {
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
};

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
      .protocol()
      .optional()
      .www()
      .optional()
      .word()
      .oneOrMore()
      .tld()
      .path()
      .optional(),
};

class HumanRegex {
  constructor() {
    this.parts = [];
    this.flags = new Set();
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
    return this.add(this.escapeRegExp(text));
  }

  range(name) {
    if (!Ranges[name]) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${Ranges[name]}]`);
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

  // Flags
  global() {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  nonSensitive() {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  // Pattern shortcuts
  protocol() {
    return this.add("(http|https)://");
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

  // Utility methods
  add(part) {
    this.parts.push(part);
    return this;
  }

  toString() {
    return this.parts.join("");
  }

  toRegExp() {
    return new RegExp(this.toString(), Array.from(this.flags).join(""));
  }

  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

// Public API
const createRegex = () => new HumanRegex();
Object.assign(createRegex, { Patterns, Flags, Ranges, Quantifiers });

module.exports = createRegex;

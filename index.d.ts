// Constants

export const Flags: {
  GLOBAL: "g";
  NON_SENSITIVE: "i";
  MULTILINE: "m";
  DOT_ALL: "s";
  UNICODE: "u";
  STICKY: "y";
};

export const Ranges: {
  digit: "0-9";
  lowercaseLetter: "a-z";
  uppercaseLetter: "A-Z";
  letter: "a-zA-Z";
  alphanumeric: "a-zA-Z0-9";
  anyCharacter: ".";
};

export type RangeKeys = keyof typeof Ranges;

export const Quantifiers: {
  zeroOrMore: "*";
  oneOrMore: "+";
  optional: "?";
};

// The type of quantifier operators used in chain methods
export type QuantifiersType =
  | "exactly"
  | "atLeast"
  | "atMost"
  | "between"
  | "oneOrMore"
  | "zeroOrMore"
  | "repeat";
export type QuantifierMethods = QuantifiersType | "optional" | "lazy";

// Helper chainable types – they “narrow” the available methods at each stage.
export type WithLazy = HumanRegex;
export type Base = Omit<HumanRegex, "lazy">;
export type AtStart = Omit<Base, QuantifierMethods | "endGroup">;
export type AfterAnchor = Omit<Base, QuantifierMethods | "or">;
export type SimpleQuantifier = Omit<Base, QuantifiersType>;
export type LazyQuantifier = Omit<HumanRegex, QuantifiersType>;

// Main class

export class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor();

  // Basic pattern methods
  digit(): Base;
  special(): Base;
  word(): Base;
  whitespace(): Base;
  nonWhitespace(): Base;
  literal(text: string): this;
  or(): AfterAnchor;

  range(name: RangeKeys): Base;
  notRange(chars: string): Base;
  lazy(): Base;
  letter(): Base;
  anyCharacter(): Base;

  // Lookahead/behind
  negativeLookahead(pattern: string): Base;
  positiveLookahead(pattern: string): Base;
  positiveLookbehind(pattern: string): Base;
  negativeLookbehind(pattern: string): Base;

  // “Has” assertions
  hasSpecialCharacter(): Base;
  hasDigit(): Base;
  hasLetter(): Base;

  // Quantifiers
  optional(): SimpleQuantifier;
  exactly(n: number): SimpleQuantifier;
  atLeast(n: number): LazyQuantifier;
  atMost(n: number): LazyQuantifier;
  between(min: number, max: number): LazyQuantifier;
  oneOrMore(): LazyQuantifier;
  zeroOrMore(): LazyQuantifier;

  // Grouping
  startNamedGroup(name: string): AfterAnchor;
  startGroup(): AfterAnchor;
  startCaptureGroup(): AfterAnchor;
  wordBoundary(): Base;
  nonWordBoundary(): Base;
  endGroup(): Base;

  // Anchors
  startAnchor(): AfterAnchor;
  endAnchor(): AfterAnchor;

  // Flags
  global(): this;
  nonSensitive(): this;
  multiline(): this;
  dotAll(): this;
  sticky(): this;

  // Unicode properties
  unicodeChar(variant?: "u" | "l" | "t" | "m" | "o"): Base;
  unicodeDigit(): Base;
  unicodePunctuation(): Base;
  unicodeSymbol(): Base;

  // Extra helpers
  repeat(count: number): Base;
  ipv4Octet(): Base;
  protocol(): Base;
  www(): Base;
  tld(): Base;
  path(): Base;

  toString(): string;
  toRegExp(): RegExp;
}

// The starting point of the builder returns an AtStart (a subset of HumanRegex)
export function createRegex(): AtStart;

// Cached patterns
export const Patterns: {
  email: () => RegExp;
  url: () => RegExp;
  phoneInternational: () => RegExp;
};

// Utility function for escaping literals
export function escapeLiteral(text: string): string;

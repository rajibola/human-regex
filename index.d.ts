export const Flags: {
  GLOBAL: string;
  NON_SENSITIVE: string;
  MULTILINE: string;
  DOT_ALL: string;
  UNICODE: string;
  STICKY: string;
};

export declare const Ranges: {
  digit: string;
  lowercaseLetter: string;
  uppercaseLetter: string;
  letter: string;
  alphanumeric: string;
  anyCharacter: string;
};

export type RangeKeys = keyof typeof Ranges;

export interface Quantifiers {
  zeroOrMore: string;
  oneOrMore: string;
  optional: string;
}

export class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor();

  // Character classes and literals
  digit(): this;
  special(): this;
  word(): this;
  whitespace(): this;
  nonWhitespace(): this;
  literal(text: string): this;
  or(): this;

  // Ranges and character sets
  range(name: RangeKeys): this;
  notRange(chars: string): this;
  letter(): this;
  anyCharacter(): this;

  // Quantifiers
  exactly(n: number): this;
  atLeast(n: number): this;
  atMost(n: number): this;
  between(min: number, max: number): this;
  oneOrMore(): this;
  optional(): this;
  zeroOrMore(): this;
  lazy(): this;

  // Grouping and capturing
  startGroup(): this;
  startCaptureGroup(): this;
  startNamedGroup(name: string): this;
  endGroup(): this;

  // Boundaries and anchors
  wordBoundary(): this;
  nonWordBoundary(): this;
  startAnchor(): this;
  endAnchor(): this;

  // Lookaround assertions
  negativeLookahead(pattern: string): this;
  positiveLookahead(pattern: string): this;
  positiveLookbehind(pattern: string): this;
  negativeLookbehind(pattern: string): this;

  // Validation helpers
  hasSpecialCharacter(): this;
  hasDigit(): this;
  hasLetter(): this;

  // Flag management
  global(): this;
  nonSensitive(): this;
  multiline(): this;
  dotAll(): this;
  sticky(): this;

  // Unicode properties
  unicodeChar(variant?: "u" | "l" | "t" | "m" | "o"): this;
  unicodeDigit(): this;
  unicodePunctuation(): this;
  unicodeSymbol(): this;

  // Repetition and complex patterns
  repeat(count: number): this;
  ipv4Octet(): this;

  // URL related helpers
  protocol(): this;
  www(): this;
  tld(): this;
  path(): this;

  // Final output
  toString(): string;
  toRegExp(): RegExp;
}

export function createRegex(): HumanRegex;

export const Patterns: {
  email: () => RegExp;
  url: () => RegExp;
  phoneInternational: () => RegExp;
};

export function escapeLiteral(text: string): string;

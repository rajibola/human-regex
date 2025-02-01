declare module "human-regex" {
  interface HumanRegex {
    digit(): HumanRegex;
    special(): HumanRegex;
    word(): HumanRegex;
    whitespace(): HumanRegex;
    literal(text: string): HumanRegex;
    or(): HumanRegex;
    range(name: string): HumanRegex;
    letter(): HumanRegex;
    exactly(n: number): HumanRegex;
    atLeast(n: number): HumanRegex;
    atMost(n: number): HumanRegex;
    between(min: number, max: number): HumanRegex;
    oneOrMore(): HumanRegex;
    optional(): HumanRegex;
    zeroOrMore(): HumanRegex;
    startGroup(): HumanRegex;
    endGroup(): HumanRegex;
    startAnchor(): HumanRegex;
    endAnchor(): HumanRegex;
    global(): HumanRegex;
    nonSensitive(): HumanRegex;
    protocol(): HumanRegex;
    www(): HumanRegex;
    tld(): HumanRegex;
    path(): HumanRegex;
    toString(): string;
    toRegExp(): RegExp;
  }

  export function createRegex(): HumanRegex;

  export const Patterns: {
    email: () => RegExp;
    phoneInternational: () => RegExp;
    url: () => RegExp;
  };

  export const Flags: {
    GLOBAL: string;
    NON_SENSITIVE: string;
    MULTILINE: string;
    DOT_ALL: string;
    UNICODE: string;
    STICKY: string;
  };

  export const Ranges: {
    digit: string;
    lowercaseLetter: string;
    uppercaseLetter: string;
    letter: string;
    alphanumeric: string;
    anyCharacter: string;
  };

  export const Quantifiers: {
    zeroOrMore: string;
    oneOrMore: string;
    optional: string;
  };
}

type PartialBut<T, K extends keyof T> = Partial<T> & Pick<T, K>;

const escapeCache = new Map<string, string>();

const Flags = {
  GLOBAL: "g",
  NON_SENSITIVE: "i",
  MULTILINE: "m",
  DOT_ALL: "s",
  UNICODE: "u",
  STICKY: "y",
} as const;

const Ranges = Object.freeze({
  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",
});

type RangeKeys = keyof typeof Ranges;

const Quantifiers = Object.freeze({
  zeroOrMore: "*",
  oneOrMore: "+",
  optional: "?",
});

type Quantifiers =
  | "exactly"
  | "atLeast"
  | "atMost"
  | "between"
  | "oneOrMore"
  | "zeroOrMore"
  | "repeat";
type QuantifierMethods = Quantifiers | "optional" | "lazy";

type WithLazy = HumanRegex;
type Base = Omit<HumanRegex, "lazy">;

type AtStart = Omit<Base, QuantifierMethods | "endGroup">;
type AfterAnchor = Omit<Base, QuantifierMethods | "or">;
type SimpleQuantifier = Omit<Base, Quantifiers>;
type LazyQuantifier = Omit<WithLazy, Quantifiers>;

class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor() {
    this.parts = [];
    this.flags = new Set<string>();
  }

  digit(): Base {
    return this.add("\\d");
  }

  special(): Base {
    return this.add("(?=.*[!@#$%^&*])");
  }

  word(): Base {
    return this.add("\\w");
  }

  whitespace(): Base {
    return this.add("\\s");
  }

  nonWhitespace(): Base {
    return this.add("\\S");
  }

  literal(text: string): this {
    return this.add(escapeLiteral(text));
  }

  or(): AfterAnchor {
    return this.add("|");
  }

  range(name: RangeKeys): Base {
    const range = Ranges[name];
    if (!range) throw new Error(`Unknown range: ${name}`);
    return this.add(`[${range}]`);
  }

  notRange(chars: string): Base {
    return this.add(`[^${chars}]`);
  }

  lazy(): Base {
    const lastPart = this.parts.pop();
    if (!lastPart) throw new Error("No quantifier to make lazy");
    return this.add(`${lastPart}?`);
  }

  letter(): Base {
    return this.add("[a-zA-Z]");
  }

  anyCharacter(): Base {
    return this.add(".");
  }

  negativeLookahead(pattern: string): Base {
    return this.add(`(?!${pattern})`);
  }

  positiveLookahead(pattern: string): Base {
    return this.add(`(?=${pattern})`);
  }

  positiveLookbehind(pattern: string): Base {
    return this.add(`(?<=${pattern})`);
  }

  negativeLookbehind(pattern: string): Base {
    return this.add(`(?<!${pattern})`);
  }

  hasSpecialCharacter(): Base {
    return this.add("(?=.*[!@#$%^&*])");
  }

  hasDigit(): Base {
    return this.add("(?=.*\\d)");
  }

  hasLetter(): Base {
    return this.add("(?=.*[a-zA-Z])");
  }

  optional(): SimpleQuantifier {
    return this.add(Quantifiers.optional);
  }

  exactly(n: number): SimpleQuantifier {
    return this.add(`{${n}}`);
  }

  atLeast(n: number): LazyQuantifier {
    return this.add(`{${n},}`);
  }

  atMost(n: number): LazyQuantifier {
    return this.add(`{0,${n}}`);
  }

  between(min: number, max: number): LazyQuantifier {
    return this.add(`{${min},${max}}`);
  }

  oneOrMore(): LazyQuantifier {
    return this.add(Quantifiers.oneOrMore);
  }

  zeroOrMore(): LazyQuantifier {
    return this.add(Quantifiers.zeroOrMore);
  }

  startNamedGroup(name: string): AfterAnchor {
    return this.add(`(?<${name}>`);
  }

  startGroup(): AfterAnchor {
    return this.add("(?:");
  }

  startCaptureGroup(): AfterAnchor {
    return this.add("(");
  }

  wordBoundary(): Base {
    return this.add("\\b");
  }

  nonWordBoundary(): Base {
    return this.add("\\B");
  }

  endGroup(): Base {
    return this.add(")");
  }

  startAnchor(): AfterAnchor {
    return this.add("^");
  }

  endAnchor(): AfterAnchor {
    return this.add("$");
  }

  global(): this {
    this.flags.add(Flags.GLOBAL);
    return this;
  }

  nonSensitive(): this {
    this.flags.add(Flags.NON_SENSITIVE);
    return this;
  }

  multiline(): this {
    this.flags.add(Flags.MULTILINE);
    return this;
  }

  dotAll(): this {
    this.flags.add(Flags.DOT_ALL);
    return this;
  }

  sticky(): this {
    this.flags.add(Flags.STICKY);
    return this;
  }

  unicodeChar(variant?: "u" | "l" | "t" | "m" | "o"): Base {
    this.flags.add(Flags.UNICODE);
    const validVariants = new Set(["u", "l", "t", "m", "o"] as const);

    if (variant !== undefined && !validVariants.has(variant)) {
      throw new Error(`Invalid Unicode letter variant: ${variant}`);
    }

    return this.add(`\\p{L${variant ?? ""}}`);
  }

  unicodeDigit(): Base {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{N}");
  }

  unicodePunctuation(): Base {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{P}");
  }

  unicodeSymbol(): Base {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{S}");
  }

  repeat(count: number): Base {
    if (this.parts.length === 0) {
      throw new Error("No pattern to repeat");
    }

    const lastPart = this.parts.pop();
    this.parts.push(`(${lastPart}){${count}}`);
    return this;
  }

  ipv4Octet(): Base {
    return this.add("(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)");
  }

  protocol(): Base {
    return this.add("https?://");
  }

  www(): Base {
    return this.add("(www\\.)?");
  }

  tld(): Base {
    return this.add("(com|org|net)");
  }

  path(): Base {
    return this.add("(/\\w+)*");
  }

  private add(part: string): this {
    this.parts.push(part);
    return this;
  }

  toString(): string {
    return this.parts.join("");
  }

  toRegExp(): RegExp {
    return new RegExp(this.toString(), [...this.flags].join(""));
  }
}

function escapeLiteral(text: string): string {
  if (!escapeCache.has(text)) {
    escapeCache.set(text, text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  }
  return escapeCache.get(text)!;
}

const createRegex = (): AtStart => new HumanRegex();

const Patterns = (() => {
  const createCachedPattern = (builder: () => PartialBut<HumanRegex, "toRegExp">) => {
    const regex = builder().toRegExp();
    return () => new RegExp(regex.source, regex.flags);
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
        .www()
        .word()
        .oneOrMore()
        .literal(".")
        .tld()
        .path()
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

export { createRegex, Patterns, Flags, Ranges, Quantifiers };

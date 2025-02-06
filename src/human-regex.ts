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

class HumanRegex {
  private parts: string[];
  private flags: Set<string>;

  constructor() {
    this.parts = [];
    this.flags = new Set<string>();
  }

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

  nonWhitespace(): this {
    return this.add("\\S");
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

  notRange(chars: string): this {
    return this.add(`[^${chars}]`);
  }

  lazy(): this {
    const lastPart = this.parts.pop();
    if (!lastPart) throw new Error("No quantifier to make lazy");
    return this.add(`${lastPart}?`);
  }

  startNamedGroup(name: string): this {
    return this.add(`(?<${name}>`);
  }

  letter(): this {
    return this.add("[a-zA-Z]");
  }

  anyCharacter(): this {
    return this.add(".");
  }

  negativeLookahead(pattern: string): this {
    return this.add(`(?!${pattern})`);
  }

  positiveLookahead(pattern: string): this {
    return this.add(`(?=${pattern})`);
  }

  positiveLookbehind(pattern: string): this {
    return this.add(`(?<=${pattern})`);
  }

  negativeLookbehind(pattern: string): this {
    return this.add(`(?<!${pattern})`);
  }

  hasSpecialCharacter(): this {
    return this.add("(?=.*[!@#$%^&*])");
  }

  hasDigit(): this {
    return this.add("(?=.*\\d)");
  }

  hasLetter(): this {
    return this.add("(?=.*[a-zA-Z])");
  }

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

  startGroup(): this {
    return this.add("(?:");
  }

  startCaptureGroup(): this {
    return this.add("(");
  }

  wordBoundary(): this {
    return this.add("\\b");
  }

  nonWordBoundary(): this {
    return this.add("\\B");
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

  unicodeChar(variant?: "u" | "l" | "t" | "m" | "o"): this {
    this.flags.add(Flags.UNICODE);
    const validVariants = new Set(["u", "l", "t", "m", "o"] as const);

    if (variant !== undefined && !validVariants.has(variant)) {
      throw new Error(`Invalid Unicode letter variant: ${variant}`);
    }

    return this.add(`\\p{L${variant ?? ""}}`);
  }

  unicodeDigit(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{N}");
  }

  unicodePunctuation(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{P}");
  }

  unicodeSymbol(): this {
    this.flags.add(Flags.UNICODE);
    return this.add("\\p{S}");
  }

  repeat(count: number): this {
    if (this.parts.length === 0) {
      throw new Error("No pattern to repeat");
    }

    const lastPart = this.parts.pop();
    this.parts.push(`(${lastPart}){${count}}`);
    return this;
  }

  ipv4Octet(): this {
    return this.add("(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)");
  }

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

const createRegex = (): HumanRegex => new HumanRegex();

const Patterns = (() => {
  const createCachedPattern = (builder: () => HumanRegex) => {
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

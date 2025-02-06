import { createRegex, Patterns } from "../src/human-regex";

test("email pattern matches valid addresses", () => {
  const regex = Patterns.email();
  expect(regex.test("test@example.com")).toBe(true);
  expect(regex.test("name@domain.co.uk")).toBe(true);
  expect(regex.test("invalid@com")).toBe(false);
});

test("phoneInternational pattern matches valid phone numbers", () => {
  const { phoneInternational } = Patterns;

  expect(phoneInternational().test("+1-123456789")).toBe(true);
  expect(phoneInternational().test("+12-123456789")).toBe(true);
  expect(phoneInternational().test("+123-123456789")).toBe(true);
  expect(phoneInternational().test("+123-12345678901234")).toBe(true);

  expect(phoneInternational().test("1-123456789")).toBe(false);
  expect(phoneInternational().test("+1234-123456789")).toBe(false);
  expect(phoneInternational().test("+123-12")).toBe(false);
  expect(phoneInternational().test("+123-123456789012345")).toBe(false);
});

test("URL pattern matches valid URLs", () => {
  const regex = Patterns.url();
  expect(regex.test("http://www.example.com")).toBe(true);
  expect(regex.test("https://example.org/path")).toBe(true);
  expect(regex.test("ftp://example.net")).toBe(false);
});

test("custom regex with flags works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .word()
    .oneOrMore()
    .endAnchor()
    .global()
    .nonSensitive()
    .toRegExp();

  expect(regex.flags).toBe("gi");
  expect(regex.test("Test")).toBe(true);
});

test("protocol validation works", () => {
  const regex = createRegex().protocol().toRegExp();
  expect(regex.test("http://")).toBe(true);
  expect(regex.test("https://")).toBe(true);
  expect(regex.test("ftp://")).toBe(false);
});

test("range method works correctly", () => {
  const regex = createRegex().range("digit").toRegExp();
  expect(regex.test("5")).toBe(true);
  expect(regex.test("a")).toBe(false);

  const letterRegex = createRegex().range("letter").toRegExp();
  expect(letterRegex.test("a")).toBe(true);
  expect(letterRegex.test("Z")).toBe(true);
  expect(letterRegex.test("5")).toBe(false);
});

test("or method works correctly", () => {
  const regex = createRegex().literal("cat").or().literal("dog").toRegExp();
  expect(regex.test("cat")).toBe(true);
  expect(regex.test("dog")).toBe(true);
  expect(regex.test("bat")).toBe(false);
});

test("exactly method works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .exactly(3)
    .endAnchor()
    .toRegExp();
  expect(regex.test("123")).toBe(true);
  expect(regex.test("12")).toBe(false);
  expect(regex.test("1234")).toBe(false);
});

test("whitespace method works correctly", () => {
  const regex = createRegex().whitespace().toRegExp();
  expect(regex.test(" ")).toBe(true);
  expect(regex.test("\t")).toBe(true);
  expect(regex.test("a")).toBe(false);
});

test("special character method works correctly", () => {
  const regex = createRegex().special().toRegExp();
  expect(regex.test("!")).toBe(true);
  expect(regex.test("@")).toBe(true);
  expect(regex.test("a")).toBe(false);
});

test("startGroup and endGroup methods work correctly", () => {
  const regex = createRegex()
    .startGroup()
    .literal("abc")
    .endGroup()
    .literal("123")
    .toRegExp();
  expect(regex.test("abc123")).toBe(true);
  expect(regex.test("abc")).toBe(false);
  expect(regex.test("123")).toBe(false);
});

test("startAnchor and endAnchor methods work correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .literal("start")
    .endAnchor()
    .toRegExp();
  expect(regex.test("start")).toBe(true);
  expect(regex.test("start123")).toBe(false);
  expect(regex.test("123start")).toBe(false);
});

test("atLeast method works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .atLeast(2)
    .endAnchor()
    .toRegExp();
  expect(regex.test("12")).toBe(true);
  expect(regex.test("123")).toBe(true);
  expect(regex.test("1")).toBe(false);
});

test("atMost method works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .atMost(2)
    .endAnchor()
    .toRegExp();
  expect(regex.test("1")).toBe(true);
  expect(regex.test("12")).toBe(true);
  expect(regex.test("123")).toBe(false);
});

test("between method works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .between(2, 4)
    .endAnchor()
    .toRegExp();
  expect(regex.test("12")).toBe(true);
  expect(regex.test("123")).toBe(true);
  expect(regex.test("1234")).toBe(true);
  expect(regex.test("1")).toBe(false);
  expect(regex.test("12345")).toBe(false);
});

test("custom regex with flags works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .word()
    .oneOrMore()
    .endAnchor()
    .global()
    .nonSensitive()
    .toRegExp();

  expect(regex.flags).toBe("gi");
  expect(regex.test("Test")).toBe(true);
});

test("protocol validation works", () => {
  const regex = createRegex().protocol().toRegExp();
  expect(regex.test("http://")).toBe(true);
  expect(regex.test("https://")).toBe(true);
  expect(regex.test("ftp://")).toBe(false);
});

test("range method works correctly", () => {
  const regex = createRegex().range("digit").toRegExp();
  expect(regex.test("5")).toBe(true);
  expect(regex.test("a")).toBe(false);

  const letterRegex = createRegex().range("letter").toRegExp();
  expect(letterRegex.test("a")).toBe(true);
  expect(letterRegex.test("Z")).toBe(true);
  expect(letterRegex.test("5")).toBe(false);
});

test("or method works correctly", () => {
  const regex = createRegex().literal("cat").or().literal("dog").toRegExp();
  expect(regex.test("cat")).toBe(true);
  expect(regex.test("dog")).toBe(true);
  expect(regex.test("bat")).toBe(false);
});

test("exactly method works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .exactly(3)
    .endAnchor()
    .toRegExp();
  expect(regex.test("123")).toBe(true);
  expect(regex.test("12")).toBe(false);
  expect(regex.test("1234")).toBe(false);
});

test("whitespace method works correctly", () => {
  const regex = createRegex().whitespace().toRegExp();
  expect(regex.test(" ")).toBe(true);
  expect(regex.test("\t")).toBe(true);
  expect(regex.test("a")).toBe(false);
});

test("regex works for password validation", () => {
  const regex = createRegex()
    .startAnchor()
    .hasSpecialCharacter()
    .hasDigit()
    .hasLetter()
    .anyCharacter()
    .atLeast(8)
    .endAnchor()
    .toRegExp();

  expect(regex.test("a1234567!")).toBe(true);
  expect(regex.test("a1234567")).toBe(false);
  expect(regex.test("a1234567!a")).toBe(true);
  expect(regex.test("a167!a")).toBe(false);
  expect(regex.test("P@ssw0rd")).toBe(true);
});

test("ISO 8601 date validation", () => {
  const isoDate = createRegex()
    .startAnchor()
    .digit()
    .exactly(4)
    .literal("-")
    .digit()
    .exactly(2)
    .literal("-")
    .digit()
    .exactly(2)
    .endAnchor()
    .toRegExp();
  expect(isoDate.test("2023-12-31")).toBe(true);
  expect(isoDate.test("13/12/2023")).toBe(false);
});

test("Visa card validation", () => {
  const visaPattern = createRegex()
    .startAnchor()
    .literal("4")
    .digit()
    .exactly(15)
    .endAnchor()
    .toRegExp();
  expect(visaPattern.test("4111111111111111")).toBe(true); // Passes
});

test("IPv4 validation", () => {
  const ipv4 = createRegex()
    .startAnchor()
    .ipv4Octet() // First octet
    .literal(".")
    .ipv4Octet() // Second octet
    .literal(".")
    .ipv4Octet() // Third octet
    .literal(".")
    .ipv4Octet() // Fourth octet
    .endAnchor()
    .toRegExp();

  // Valid IPv4 addresses
  expect(ipv4.test("192.168.0.1")).toBe(true);
  expect(ipv4.test("10.0.0.0")).toBe(true);
  expect(ipv4.test("255.255.255.255")).toBe(true);
  expect(ipv4.test("0.0.0.0")).toBe(true);

  // Invalid IPv4 addresses
  expect(ipv4.test("192.168.0")).toBe(false);
  expect(ipv4.test("256.0.0.0")).toBe(false);
  expect(ipv4.test("192.168.0.256")).toBe(false);
  expect(ipv4.test("1234.56.78.90")).toBe(false);
  expect(ipv4.test("192.168.0.")).toBe(false);
  expect(ipv4.test("192.168.0.a")).toBe(false);
});

test("nonWhitespace method works correctly", () => {
  const regex = createRegex().nonWhitespace().toRegExp();
  expect(regex.test("a")).toBe(true);
  expect(regex.test("5")).toBe(true);
  expect(regex.test(" ")).toBe(false);
});

test("lazy method modifies quantifier correctly", () => {
  const regex = createRegex().literal("a").oneOrMore().lazy().toRegExp();
  expect("aaa".match(regex)?.[0]).toBe("a");
});

test("startNamedGroup creates proper named group", () => {
  const regex = createRegex()
    .startNamedGroup("test")
    .digit()
    .endGroup()
    .toRegExp();
  expect(regex.source).toContain("(?<test>");
});

test("negativeLookahead works correctly", () => {
  const regex = createRegex()
    .literal("foo")
    .negativeLookahead("bar")
    .toRegExp();
  expect(regex.test("foobaz")).toBe(true);
  expect(regex.test("foobar")).toBe(false);
});

test("unicodeChar matches appropriate characters", () => {
  const regex = createRegex().unicodeChar("u").toRegExp();
  expect(regex.test("A")).toBe(true);
  expect(regex.test("À")).toBe(true);
  expect(regex.test("1")).toBe(false);
  expect(regex.flags).toContain("u");
});

test("sticky flag works correctly", () => {
  const regex = createRegex().literal("a").sticky().toRegExp();
  expect(regex.sticky).toBe(true);
  expect(regex.test("aaa")).toBe(true);
});

test("wordBoundary works correctly", () => {
  const regex = createRegex()
    .wordBoundary()
    .literal("test")
    .wordBoundary()
    .toRegExp();
  expect(regex.test("test")).toBe(true);
  expect(regex.test("atest")).toBe(false);
});

test("notRange excludes specified characters", () => {
  const regex = createRegex().notRange("aeiou").toRegExp();
  expect(regex.test("b")).toBe(true);
  expect(regex.test("a")).toBe(false);
});

test("zeroOrMore works correctly", () => {
  const regex = createRegex().literal("a").zeroOrMore().toRegExp();
  expect(regex.test("")).toBe(true);
  expect(regex.test("aaaa")).toBe(true);
});

test("optional works correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .literal("a")
    .optional()
    .endAnchor()
    .toRegExp();
  expect(regex.test("")).toBe(true);
  expect(regex.test("a")).toBe(true);
  expect(regex.test("aa")).toBe(false);
});

test("dotAll flag allows dot to match newlines", () => {
  const regex = createRegex().anyCharacter().dotAll().toRegExp();
  expect(regex.test("\n")).toBe(true);
});

test("multiline flag affects anchors correctly", () => {
  const regex = createRegex()
    .startAnchor()
    .literal("test")
    .endAnchor()
    .multiline()
    .toRegExp();
  expect("test\ntest".match(regex)).toHaveLength(1);
});

test("path matches valid URL paths", () => {
  const regex = createRegex().startAnchor().path().endAnchor().toRegExp();
  expect(regex.test("/path/to/resource")).toBe(true);
  expect(regex.test("/invalid@path")).toBe(false);
});

test("tld matches valid top-level domains", () => {
  const regex = createRegex().startAnchor().tld().endAnchor().toRegExp();
  expect(regex.test("com")).toBe(true);
  expect(regex.test("net")).toBe(true);
  expect(regex.test("org")).toBe(true);
  expect(regex.test("invalid")).toBe(false);
});

test("www matches optional www prefix", () => {
  const regex = createRegex().startAnchor().www().endAnchor().toRegExp();
  expect(regex.test("www.")).toBe(true);
  expect(regex.test("")).toBe(true);
  expect(regex.test("invalid.")).toBe(false);
});

test("repeat works with complex patterns", () => {
  const regex = createRegex()
    .startGroup()
    .digit()
    .literal("-")
    .endGroup()
    .repeat(3)
    .toRegExp();
  expect(regex.test("1-2-3-")).toBe(true);
  expect(regex.test("1-2-")).toBe(false);
});

test("throws error when making empty pattern lazy", () => {
  expect(() => createRegex().lazy()).toThrow("No quantifier to make lazy");
});

test("literal escapes special characters", () => {
  const regex = createRegex().literal(".*+?^${}()|[]\\").toRegExp();
  expect(regex.test(".*+?^${}()|[]\\")).toBe(true);
});

test("positiveLookahead works correctly", () => {
  // This should match "foo" only if followed by "bar"
  const regex = createRegex()
    .literal("foo")
    .positiveLookahead("bar")
    .toRegExp();
  expect(regex.test("foobar")).toBe(true);
  expect(regex.test("foobaz")).toBe(false);
});

test("positiveLookbehind works correctly", () => {
  // Matches "bar" only if preceded by "foo"
  const regex = createRegex()
    .positiveLookbehind("foo")
    .literal("bar")
    .toRegExp();
  expect(regex.test("foobar")).toBe(true);
  expect(regex.test("bar")).toBe(false);
});

test("negativeLookbehind works correctly", () => {
  // Matches "bar" only if not preceded by "foo"
  const regex = createRegex()
    .negativeLookbehind("foo")
    .literal("bar")
    .toRegExp();
  expect(regex.test("foobar")).toBe(false);
  expect(regex.test("bazbar")).toBe(true);
});

test("unicodeDigit matches Unicode digits", () => {
  // Unicode digit should match both ASCII and non-ASCII digits (if available)
  const regex = createRegex().unicodeDigit().toRegExp();
  expect(regex.test("5")).toBe(true);
  // For some non-ASCII numeral, depending on Unicode data:
  expect(regex.test("٥")).toBe(true); // Arabic-Indic digit 5
});

test("unicodePunctuation matches Unicode punctuation", () => {
  const regex = createRegex().unicodePunctuation().toRegExp();
  // The character "，" is a Unicode punctuation (fullwidth comma)
  expect(regex.test("，")).toBe(true);
  // Regular letter should not match
  expect(regex.test("a")).toBe(false);
});

test("unicodeSymbol matches Unicode symbols", () => {
  const regex = createRegex().unicodeSymbol().toRegExp();
  // For example, "♠" is a Unicode symbol
  expect(regex.test("♠")).toBe(true);
  // A digit should not match
  expect(regex.test("3")).toBe(false);
});

test("letter method matches letters correctly", () => {
  const regex = createRegex().letter().toRegExp();
  expect(regex.test("a")).toBe(true);
  expect(regex.test("Z")).toBe(true);
  expect(regex.test("1")).toBe(false);
});

test("word method matches word characters", () => {
  const regex = createRegex().word().toRegExp();
  // Should match letters, digits, and underscore
  expect(regex.test("a")).toBe(true);
  expect(regex.test("Z")).toBe(true);
  expect(regex.test("5")).toBe(true);
  expect(regex.test("_")).toBe(true);
  // Should not match a space
  expect(regex.test(" ")).toBe(false);
});

test("named capture group extracts the captured text", () => {
  const regex = createRegex()
    .startNamedGroup("digits")
    .digit()
    .oneOrMore()
    .endGroup()
    .literal("-")
    .literal("end")
    .toRegExp();
  const match = "12345-end".match(regex);
  // Ensure the named group 'digits' was captured correctly.
  expect(match?.groups?.digits).toBe("12345");
});

test("repeat method repeats a complex pattern", () => {
  // Build a pattern that matches a group (digit + literal "-") repeated 3 times.
  const regex = createRegex()
    .startGroup()
    .digit()
    .literal("-")
    .endGroup()
    .repeat(3)
    .toRegExp();
  expect(regex.test("1-2-3-")).toBe(true);
  expect(regex.test("1-2-")).toBe(false);
});

const createRegex = require("../src/human-regex");

test("creates email regex with full match anchors", () => {
  const regex = createRegex()
    .startAnchor() // Add start anchor
    .word()
    .oneOrMore()
    .literal("@")
    .word()
    .oneOrMore()
    .literal(".")
    .letter()
    .atLeast(2)
    .endAnchor() // Add end anchor
    .toRegExp();

  // Valid cases
  expect(regex.test("test@example.com")).toBe(true);
  expect(regex.test("name@domain.co")).toBe(true);

  // Invalid cases
  expect(regex.test("invalid@com")).toBe(false); // TLD too short
  expect(regex.test("test@.com")).toBe(false); // Missing domain
  expect(regex.test("test@domain.c")).toBe(false); // TLD too short
  expect(regex.test(" test@example.com ")).toBe(false); // Extra spaces
});

test("creates US phone number regex with exact match", () => {
  const regex = createRegex()
    .startAnchor()
    .digit()
    .exactly(3)
    .literal("-")
    .digit()
    .exactly(3)
    .literal("-")
    .digit()
    .exactly(4)
    .endAnchor()
    .toRegExp();

  // Valid
  expect(regex.test("123-456-7890")).toBe(true);

  // Invalid
  expect(regex.test("123-45-7890")).toBe(false);
  expect(regex.test("1234-56-7890")).toBe(false);
  expect(regex.test("12a-456-7890")).toBe(false);
  expect(regex.test(" 123-456-7890 ")).toBe(false);
});

test("creates URL regex with proper structure", () => {
  const regex = createRegex()
    .startAnchor()
    .startGroup() // Group protocol section
    .protocol()
    .endGroup()
    .optional() // Make entire protocol optional
    .www() // Already contains (www\.)?
    .word()
    .oneOrMore()
    .literal(".") // Explicit domain-TLD separator
    .tld()
    .path() // Already contains (/\\w+)*
    .endAnchor()
    .toRegExp();

  // Valid URLs
  expect(regex.test("http://www.example.com")).toBe(true);
  expect(regex.test("https://example.org/path")).toBe(true);
  expect(regex.test("www.example.net")).toBe(true);

  // Invalid URLs
  expect(regex.test("ftp://example.net")).toBe(false); // Invalid protocol
  expect(regex.test("example..com")).toBe(false); // Double dot
  expect(regex.test("domain.x")).toBe(false); // Invalid TLD
});

test("creates range regex with full string match", () => {
  const regex = createRegex()
    .startAnchor()
    .range("digit")
    .oneOrMore()
    .literal("-")
    .range("letter")
    .oneOrMore()
    .endAnchor()
    .toRegExp();

  expect(regex.test("123-abc")).toBe(true); // Valid
  expect(regex.test("123-")).toBe(false); // Missing letters
  expect(regex.test("-abc")).toBe(false); // Missing digits
  expect(regex.test("a123-bcd")).toBe(false); // Letters before digits
});

test("handles flags correctly with case insensitivity", () => {
  const regex = createRegex()
    .startAnchor()
    .word()
    .oneOrMore()
    .endAnchor()
    .global()
    .nonSensitive()
    .toRegExp();

  // Test flag combination
  expect(regex.flags).toBe("gi");

  // Reset lastIndex between tests
  regex.lastIndex = 0;
  expect(regex.test("Test")).toBe(true);

  regex.lastIndex = 0;
  expect(regex.test("TEST")).toBe(true);

  regex.lastIndex = 0;
  expect(regex.test("tEsT")).toBe(true);
});

// New test for protocol validation
test("validates protocol correctly", () => {
  const regex = createRegex().protocol().toRegExp();

  expect(regex.test("http://")).toBe(true);
  expect(regex.test("https://")).toBe(true);
  expect(regex.test("ftp://")).toBe(false);
  expect(regex.test("http//")).toBe(false);
});

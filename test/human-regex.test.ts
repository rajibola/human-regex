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

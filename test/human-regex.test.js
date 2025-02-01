const createRegex = require("../src/human-regex");

test("email pattern matches valid addresses", () => {
  const regex = createRegex.Patterns.email();
  expect(regex.test("test@example.com")).toBe(true);
  expect(regex.test("name@domain.co.uk")).toBe(true);
  expect(regex.test("invalid@com")).toBe(false);
});

test("phoneInternational pattern matches valid phone numbers", () => {
  const { phoneInternational } = createRegex.Patterns;

  // Valid cases
  expect(phoneInternational().test("+1-123456789")).toBe(true);
  expect(phoneInternational().test("+12-123456789")).toBe(true);
  expect(phoneInternational().test("+123-123456789")).toBe(true);
  expect(phoneInternational().test("+123-12345678901234")).toBe(true);

  // Invalid cases
  expect(phoneInternational().test("1-123456789")).toBe(false);
  expect(phoneInternational().test("+1234-123456789")).toBe(false);
  expect(phoneInternational().test("+123-12")).toBe(false);
  expect(phoneInternational().test("+123-123456789012345")).toBe(false);
});

test("URL pattern matches valid URLs", () => {
  const regex = createRegex.Patterns.url();
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

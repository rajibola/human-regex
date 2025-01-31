const { createRegex } = require("../src/human-regex");

test("creates simple email regex", () => {
  const regex = createRegex()
    .word()
    .oneOrMore()
    .literal("@")
    .word()
    .oneOrMore()
    .literal(".")
    .letter()
    .atLeast(2)
    .toRegExp();

  expect(regex.test("test@example.com")).toBe(true);
  expect(regex.test("invalid@com")).toBe(false);
});

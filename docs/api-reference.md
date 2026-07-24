# API Reference

## Core Methods

```javascript
.digit()       // Matches any digit (0-9)
.word()        // Matches word character (a-z, A-Z, 0-9, _)
.literal(text) // Matches exact text string (special characters are escaped)
.regex(input)  // Splices an existing RegExp or pattern string into the chain
```

### `.regex(input: RegExp | string)`

Inserts an existing pattern into the chain, verbatim. Use this to reuse a regex
you already have rather than rebuilding it.

- Accepts a `RegExp` (e.g. `/^[A-Z]/`) or a raw pattern string (e.g. `"[A-Z]"`).
- When given a `RegExp`, its flags (`g`, `i`, …) are merged into the builder.
- The input is treated as a **pattern**, so metacharacters keep their regex
  meaning. To match text literally instead, use `.literal()`.
- If a string is not a valid regex pattern, `.regex()` throws immediately with a
  message pointing you to `.literal()`.

```javascript
createRegex().regex(/^[A-Z]/).digit().exactly(3).toRegExp(); // /^[A-Z]\d{3}/
```

## Quantifiers

```javascript
.exactly(3)    // Match exactly 3 times
.atLeast(2)    // Match 2 or more times
.between(1,5)  // Match between 1-5 times
```

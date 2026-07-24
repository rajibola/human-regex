# Frequently Asked Questions

## Q: How do I match special characters?

A: Use `.literal('\\$')` to match $ symbol

## Q: Can I use existing regex patterns?

A: Yes! Use the `.regex(/existing-pattern/)` method. It also accepts a raw
pattern string and merges any flags from a passed `RegExp`.

Note that `.regex()` treats its input as a **pattern**, so characters like `.`,
`*`, and `(` act as regex metacharacters. If you instead want to match those
characters as plain text, use `.literal()`:

```javascript
createRegex().regex("a.b"); // "." matches ANY character → matches "axb", "a.b", ...
createRegex().literal("a.b"); // "." is escaped → matches only the exact text "a.b"
```

## Q: How to make case-insensitive matches?

A: Chain `.nonSensitive()` before `.toRegExp()`

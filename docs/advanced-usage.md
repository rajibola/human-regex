# Advanced Usage

## Combining with Existing Regex

Use `.regex()` to splice a pattern you already have into the chain. It accepts a
`RegExp` or a raw pattern string, and merges any flags from a passed `RegExp`.

```javascript
const basePattern = /^[A-Z]/;
const combined = createRegex().regex(basePattern).digit().exactly(3).toRegExp();
// /^[A-Z]\d{3}/
```

The input is treated as a **regex pattern**, not literal text — so `.` , `*`, `(`
and other metacharacters keep their regex meaning. If you want to match text
literally, use `.literal()` instead. Passing an invalid pattern string throws a
descriptive error at the call site rather than later at `.toRegExp()`:

```javascript
createRegex().regex("("); // throws: Invalid regex pattern passed to .regex(): "(" ...
createRegex().literal("("); // matches a literal "(" character
```

## Lookaheads/Lookbehinds

```javascript
createRegex().literal("(?<=@)").word().oneOrMore().toRegExp();
```

## Named Capture Groups

```javascript
createRegex()
  .literal("(?<year>\\d{4})")
  .literal("-")
  .literal("(?<month>\\d{2})")
  .toRegExp();
```

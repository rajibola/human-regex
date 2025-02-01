[![npm version](https://img.shields.io/npm/v/human-regex.svg)](https://www.npmjs.com/package/human-regex)
[![Build Status](https://github.com/rajibola/human-regex/actions/workflows/test.yml/badge.svg)](https://github.com/rajibola/human-regex/actions)
[![Coverage Status](https://coveralls.io/repos/github/rajibola/human-regex/badge.svg)](https://coveralls.io/github/rajibola/human-regex)

# Human Regex 🤖➡️👤

Human-friendly regular expression builder with English-like syntax.

## Installation

```bash
npm install human-regex
```

## Usage

```javascript
const { createRegex } = require("human-regex");

// Simple password validation
const passwordRegex = createRegex()
  .digit() // Must contain digit
  .special() // Must contain special char
  .range("alphanumeric") // Must contain alphanumeric char
  .atLeast(8) // Must be at least 8 characters long
  .toRegExp(); // Convert to RegExp object
```

## API Reference

### `createRegex()`

Creates a new regex builder instance.

### Methods

- `.literal(text: string)`: Adds a literal string to the pattern.
- `.digit()`: Adds a digit pattern (`\d`).
- `.word()`: Adds a word character pattern (`\w`).
- `.range(name: string)`: Adds a predefined character range.
- `.atLeast(n: number)`: Specifies that the preceding element must appear at least `n` times.
- `.exactly(n: number)`: Specifies that the preceding element must appear exactly `n` times.
- `.oneOrMore()`: Specifies that the preceding element must appear one or more times.
- `.optional()`: Specifies that the preceding element is optional.
- `.zeroOrMore()`: Specifies that the preceding element can appear zero or more times.
- `.startGroup()`: Starts a non-capturing group.
- `.endGroup()`: Ends a non-capturing group.
- `.startAnchor()`: Adds a start-of-string anchor (`^`).
- `.endAnchor()`: Adds an end-of-string anchor (`$`).
- `.global()`: Adds the global flag (`g`).
- `.nonSensitive()`: Adds the case-insensitive flag (`i`).
- `.multiline()`: Adds the multiline flag (`m`).
- `.dotAll()`: Adds the dot-all flag (`s`).
- `.unicode()`: Adds the Unicode flag (`u`).
- `.sticky()`: Adds the sticky flag (`y`).
- `.toRegExp()`: Converts the builder to a `RegExp` object.

## Examples

### Combining with Existing Regex

```javascript
const basePattern = /^[A-Z]/;
const combined = createRegex().regex(basePattern).digit().exactly(3).toRegExp();
```

### Lookaheads/Lookbehinds

```javascript
createRegex().literal("(?<=@)").word().oneOrMore().toRegExp();
```

### Named Capture Groups

```javascript
createRegex()
  .literal("(?<year>\\d{4})")
  .literal("-")
  .literal("(?<month>\\d{2})")
  .toRegExp();
```

## Contributing

We welcome contributions! Please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![npm version](https://img.shields.io/npm/v/human-regex.svg)](https://www.npmjs.com/package/human-regex)
[![Build Status](https://github.com/rajibola/human-regex/actions/workflows/test.yml/badge.svg)](https://github.com/rajibola/human-regex/actions)
[![Coverage Status](https://coveralls.io/repos/github/rajibola/human-regex/badge.svg)](https://coveralls.io/github/rajibola/human-regex)

# Human Regex 🤖➡️👤

Human-friendly regular expression builder with English-like syntax.

## Features

- 🧩 Intuitive builder pattern with chainable methods
- 🎯 Prebuilt validators for common patterns (emails, URLs, phone numbers)
- 📚 Comprehensive character classes and quantifiers
- 🛡️ Type-safe implementation with TypeScript
- ⚡ Memoized patterns for better performance
- 🔍 Supports all standard regex flags

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Predefined Patterns](#predefined-patterns)
- [Comprehensive API Reference](#comprehensive-api-reference)
  - [Core Methods](#core-methods)
  - [Quantifiers](#quantifiers)
  - [Anchors & Groups](#anchors--groups)
  - [Validation Helpers](#validation-helpers)
  - [URL Components](#url-components)
  - [Flags](#flags)
  - [Unicode Properties](#unicode-properties)
  - [Predefined Patterns](#predefined-patterns)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install human-regex
```

## Usage

### Basic Example

```javascript
import { createRegex } from "human-regex";

// Password validation: 8+ chars with special character, digit, and letter
const passwordRegex = createRegex()
  .startAnchor()
  .hasSpecialCharacter()
  .hasDigit()
  .hasLetter()
  .anyCharacter()
  .atLeast(8)
  .endAnchor()
  .toRegExp();

console.log(passwordRegex.test("P@ssw0rd")); // true
```

### Predefined Patterns

```javascript
import { Patterns } from "human-regex";

// Email validation
console.log(Patterns.email().test("test@example.com")); // true

// International phone number
console.log(Patterns.phoneInternational().test("+123-4567890")); // true

// URL validation
console.log(Patterns.url().test("https://www.example.com/path")); // true
```

## Comprehensive API Reference

### `createRegex()`

Creates a new regex builder instance.

### Core Methods

| Method               | Description                                     | Example Output |
| -------------------- | ----------------------------------------------- | -------------- |
| `.digit()`           | Adds a digit pattern (`\d`).                    | `\d`           |
| `.word()`            | Adds a word character pattern (`\w`).           | `\w`           |
| `.whitespace()`      | Adds a whitespace character pattern (`\s`).     | `\s`           |
| `.nonWhitespace()`   | Adds a non-whitespace character pattern (`\S`). | `\S`           |
| `.anyCharacter()`    | Adds a pattern for any character (`.`).         | `.`            |
| `.literal("text")`   | Adds a literal text pattern.                    | `["text"]`     |
| `.or()`              | Adds an OR pattern.                             | `\|`           |
| `.newline()`         | Adds a pattern for newline characters.          | `(\r\n\|\r\|\n)` |
| `.range("digit")`    | Adds a range pattern for digits (`0-9`).        | `[0-9]`        |
| `.notRange("letter")` | Adds a range pattern for non-letters           | `[^a-zA-Z]`     |
| `.anyOf("aeiou\\s")`    | Adds list of accepted characters          | `[aeiou\s]`     |
| `.notAnyOf("aeiou\\s")` | Adds list of excluded characters          | `[^aeiou\s]`     |



### Quantifiers

| Method               | Description                                       | Example Output |
| -------------------- | ------------------------------------------------- | -------------- |
| `.exactly(n)`        | Adds an exact quantifier (`{n}`).                 | `{n}`          |
| `.atLeast(n)`        | Adds a minimum quantifier (`{n,}`).               | `{n,}`         |
| `.atMost(n)`         | Adds a maximum quantifier (`{0,n}`).              | `{0,n}`        |
| `.between(min, max)` | Adds a range quantifier (`{min,max}`).            | `{min,max}`    |
| `.oneOrMore()`       | Adds a one-or-more quantifier (`+`).              | `+`            |
| `.optional()`        | Adds an optional quantifier (`?`).                | `?`            |
| `.zeroOrMore()`      | Adds a zero-or-more quantifier (`*`).             | `*`            |
| `.lazy()`            | Makes the previous quantifier lazy.               | `?`            |
| `.repeat(count)`     | Repeats the previous pattern exactly count times. | `{count}`      |

### Anchors & Groups

| Method                     | Description                                | Example Output |
| -------------------------- | ------------------------------------------ | -------------- |
| `.startGroup()`            | Starts a non-capturing group (`(?:`).      | `(?:`          |
| `.startCaptureGroup()`     | Starts a capturing group (`(`).            | `(`            |
| `.startNamedGroup("name")` | Starts a named capturing group.            | `(?<name>`     |
| `.endGroup()`              | Ends a group (`)`).                        | `)`            |
| `.startAnchor()`           | Adds a start anchor (`^`).                 | `^`            |
| `.endAnchor()`             | Adds an end anchor (`$`).                  | `$`            |
| `.wordBoundary()`          | Adds a word boundary assertion (`\b`).     | `\b`           |
| `.nonWordBoundary()`       | Adds a non-word boundary assertion (`\B`). | `\B`           |

### Validation Helpers

| Method                   | Description                              | Example Output     |
| ------------------------ | ---------------------------------------- | ------------------ |
| `.hasSpecialCharacter()` | Adds a lookahead for special characters. | `(?=.*[!@#$%^&*])` |
| `.hasDigit()`            | Adds a lookahead for digits.             | `(?=.*\d)`         |
| `.hasLetter()`           | Adds a lookahead for letters.            | `(?=.*[a-zA-Z])`   |

### URL Components

| Method        | Description                            | Example Output            |
| ------------- | -------------------------------------- | ------------------------- |
| `.protocol()` | Adds a protocol pattern (`https?://`). | `https?://`               |
| `.www()`      | Adds a www pattern (`(www\.)?`).       | `(www\.)?`                |
| `.path()`     | Adds a path pattern (`(/\w+)*`).       | `(/\w+)*`                 |
| `.tld()`      | Adds a top-level domain pattern. Matches any letters TLD by default, or pass a list to restrict it, e.g. `.tld(["com", "org"])`. | `([a-zA-Z]{2,})` |

### Flags

| Method            | Description                           | Example Output |
| ----------------- | ------------------------------------- | -------------- |
| `.global()`       | Adds the global flag (`g`).           | `g`            |
| `.nonSensitive()` | Adds the case-insensitive flag (`i`). | `i`            |
| `.multiline()`    | Adds the multiline flag (`m`).        | `m`            |
| `.dotAll()`       | Adds the dot-all flag (`s`).          | `s`            |
| `.sticky()`       | Adds the sticky flag (`y`).           | `y`            |

### Unicode Properties

| Method                  | Description                  | Example Output |
| ----------------------- | ---------------------------- | -------------- |
| `.unicodeChar()`        | Matches Unicode characters.  | `\p{L}`        |
| `.unicodeDigit()`       | Matches Unicode digits.      | `\p{N}`        |
| `.unicodePunctuation()` | Matches Unicode punctuation. | `\p{P}`        |
| `.unicodeSymbol()`      | Matches Unicode symbols.     | `\p{S}`        |

### Predefined Patterns

- `Patterns.email`: Predefined email pattern. Allows dots and plus-addressing in the local part (e.g. `name.surname@example.com`, `user+tag@example.com`).
- `Patterns.url`: Predefined URL pattern. Accepts any TLD, subdomains, and an optional query string.
- `Patterns.phoneInternational`: Predefined international phone number pattern. Accepts a hyphen, a space, or no separator after the country code.

### Predefined Ranges

For use with `range()` and `notRange()`:

  digit: "0-9",
  lowercaseLetter: "a-z",
  uppercaseLetter: "A-Z",
  letter: "a-zA-Z",
  alphanumeric: "a-zA-Z0-9",
  anyCharacter: ".",

| RangeKey                  | Range value    |
| ------------------------ | --------------- | 
| `digit`                  | `0-9`           | 
| `lowercaseLetter`        | `a-z`           | 
| `uppercaseLetter`        | `A-Z`           |
| `letter`                 | `a-zA-Z`        | 
| `alphanumeric`           | `a-zA-Z0-9`     | 
| `anyCharacter`           | `.`             | 

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

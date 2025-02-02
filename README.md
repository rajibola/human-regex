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

| Method             | Description                                 | Example Output |
| ------------------ | ------------------------------------------- | -------------- | ---- |
| `.digit()`         | Adds a digit pattern (`\d`).                | `\d`           |
| `.word()`          | Adds a word character pattern (`\w`).       | `\w`           |
| `.whitespace()`    | Adds a whitespace character pattern (`\s`). | `\s`           |
| `.anyCharacter()`  | Adds a pattern for any character (`.`).     | `.`            |
| `.literal("text")` | Adds a literal text pattern.                | `["text"]`     |
| `.or()`            | Adds an OR pattern (`                       | `).            | `\|` |
| `.range("digit")`  | Adds a range pattern for digits (`0-9`).    | `[0-9]`        |

### Quantifiers

| Method               | Description                            | Example Output |
| -------------------- | -------------------------------------- | -------------- |
| `.exactly(n)`        | Adds an exact quantifier (`{n}`).      | `{n}`          |
| `.atLeast(n)`        | Adds a minimum quantifier (`{n,}`).    | `{n,}`         |
| `.atMost(n)`         | Adds a maximum quantifier (`{0,n}`).   | `{0,n}`        |
| `.between(min, max)` | Adds a range quantifier (`{min,max}`). | `{min,max}`    |
| `.oneOrMore()`       | Adds a one-or-more quantifier (`+`).   | `+`            |
| `.optional()`        | Adds an optional quantifier (`?`).     | `?`            |
| `.zeroOrMore()`      | Adds a zero-or-more quantifier (`*`).  | `*`            |

### Anchors & Groups

| Method           | Description                           | Example Output |
| ---------------- | ------------------------------------- | -------------- |
| `.startGroup()`  | Starts a non-capturing group (`(?:`). | `(?:`          |
| `.endGroup()`    | Ends a group (`)`).                   | `)`            |
| `.startAnchor()` | Adds a start anchor (`^`).            | `^`            |
| `.endAnchor()`   | Adds an end anchor (`$`).             | `$`            |

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
| `.tld()`      | Adds a top-level domain pattern.       | \[\"\(com\|org\|net\)\"\] |

### Flags

| Method            | Description                           | Example Output |
| ----------------- | ------------------------------------- | -------------- |
| `.global()`       | Adds the global flag (`g`).           | `g`            |
| `.nonSensitive()` | Adds the case-insensitive flag (`i`). | `i`            |

### Predefined Patterns

- `Patterns.email`: Predefined email pattern.
- `Patterns.url`: Predefined URL pattern.
- `Patterns.phoneInternational`: Predefined international phone number pattern.

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

# Human Regex 🤖➡️👤

Human-friendly regular expression builder with English-like syntax.

[![npm version](https://img.shields.io/npm/v/human-regex.svg)](https://www.npmjs.com/package/human-regex)
[![Build Status](https://github.com/rajibola/human-regex/actions/workflows/test.yml/badge.svg)](https://github.com/rajibola/human-regex/actions)
[![Coverage Status](https://coveralls.io/repos/github/rajibola/human-regex/badge.svg)](https://coveralls.io/github/rajibola/human-regex)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Methods](#methods)
  - [Predefined Patterns](#predefined-patterns)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install human-regex
```

## Usage

```javascript
import { createRegex } from "human-regex";

// Simple password validation
const passwordRegex = createRegex()
  .startAnchor() // Start of string
  .hasSpecialCharacter() // At least one special character
  .hasDigit() // At least one digit
  .hasLetter() // At least one letter
  .anyCharacter() // Any character
  .atLeast(8) // At least 8 characters
  .endAnchor() // End of string
  .toRegExp(); // Convert to RegExp

console.log(passwordRegex.test("P@ssw0rd")); // true
```

## API Reference

### `createRegex()`

Creates a new regex builder instance.

### Methods

| Method                   | Description                                               |
| ------------------------ | --------------------------------------------------------- | --- | ------- |
| `.digit()`               | Adds a digit pattern (`\d`).                              |
| `.special()`             | Adds a special character pattern (`(?=.*[!@#$%^&*])`).    |
| `.word()`                | Adds a word character pattern (`\w`).                     |
| `.whitespace()`          | Adds a whitespace character pattern (`\s`).               |
| `.literal(text)`         | Adds a literal text pattern, escaping special characters. |
| `.or()`                  | Adds an OR pattern (`                                     | `). |
| `.range(name)`           | Adds a predefined range pattern.                          |
| `.letter()`              | Adds a letter pattern (`[a-zA-Z]`).                       |
| `.anyCharacter()`        | Adds any character pattern (`.`).                         |
| `.hasSpecialCharacter()` | Adds a lookahead for special characters.                  |
| `.hasDigit()`            | Adds a lookahead for digits.                              |
| `.hasLetter()`           | Adds a lookahead for letters.                             |
| `.exactly(n)`            | Adds an exact quantifier (`{n}`).                         |
| `.atLeast(n)`            | Adds a minimum quantifier (`{n,}`).                       |
| `.atMost(n)`             | Adds a maximum quantifier (`{0,n}`).                      |
| `.between(min, max)`     | Adds a range quantifier (`{min,max}`).                    |
| `.oneOrMore()`           | Adds a one-or-more quantifier (`+`).                      |
| `.optional()`            | Adds an optional quantifier (`?`).                        |
| `.zeroOrMore()`          | Adds a zero-or-more quantifier (`*`).                     |
| `.startGroup()`          | Starts a non-capturing group (`(?:`).                     |
| `.endGroup()`            | Ends a group (`)`).                                       |
| `.startAnchor()`         | Adds a start anchor (`^`).                                |
| `.endAnchor()`           | Adds an end anchor (`$`).                                 |
| `.global()`              | Adds the global flag (`g`).                               |
| `.nonSensitive()`        | Adds the case-insensitive flag (`i`).                     |
| `.protocol()`            | Adds a protocol pattern (`https?://`).                    |
| `.www()`                 | Adds a www pattern (`(www\.)?`).                          |
| `.tld()`                 | Adds a top-level domain pattern (`(com                    | org | net)`). |
| `.path()`                | Adds a path pattern (`(/\w+)*`).                          |
| `.toString()`            | Converts the builder to a string pattern.                 |
| `.toRegExp()`            | Converts the builder to a `RegExp` object.                |

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

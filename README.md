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
  .literal("(?=.*\\d)") // Must contain digit
  .literal("(?=.*[!@#$%^&*])") // Must contain special char
  .range("alphanumeric")
  .atLeast(8)
  .toRegExp();
```

## API Reference

[Detailed API documentation...]

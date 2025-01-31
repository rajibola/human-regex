# Getting Started

## Installation

```bash
npm install human-regex
```

## Basic Usage

```javascript
const { createRegex } = require("human-regex");

// Create a simple digit pattern
const regex = createRegex().digit().atLeast(3).toRegExp();

console.log(regex.test("123")); // true
```

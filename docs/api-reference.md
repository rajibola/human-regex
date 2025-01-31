# API Reference

## Core Methods

```javascript
.digit()       // Matches any digit (0-9)
.word()        // Matches word character (a-z, A-Z, 0-9, _)
.literal(text) // Matches exact text string
```

## Quantifiers

```javascript
.exactly(3)    // Match exactly 3 times
.atLeast(2)    // Match 2 or more times
.between(1,5)  // Match between 1-5 times
```

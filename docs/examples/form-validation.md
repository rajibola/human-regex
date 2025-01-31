# Form Validation Example

## Email Validation

```javascript
const emailRegex = createRegex()
  .word()
  .oneOrMore()
  .literal("@")
  .word()
  .oneOrMore()
  .literal(".")
  .letter()
  .atLeast(2)
  .nonSensitive()
  .toRegExp();
```

## Password Requirements

```javascript
const passwordRegex = createRegex()
  .literal("(?=.*\\d)") // Must contain digit
  .literal("(?=.*[A-Z])") // Must contain uppercase
  .range("alphanumeric")
  .atLeast(8)
  .toRegExp();
```

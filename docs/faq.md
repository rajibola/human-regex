# Frequently Asked Questions

## Q: How do I match special characters?

A: Use `.literal('\\$')` to match $ symbol

## Q: Can I use existing regex patterns?

A: Yes! Use `.regex(/existing-pattern/)` method

## Q: How to make case-insensitive matches?

A: Chain `.nonSensitive()` before `.toRegExp()`

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [Brief description of new features]

### Changed

- [Existing functionality changes]

### Deprecated

- [Soon-to-be removed features]

### Removed

- [Deleted features]

### Fixed

- [Bug fixes]

### Security

- [Security-related updates]

---

## [1.0.0] - 2025-01-31

### Initial Release

- Core regex builder functionality
- Predefined patterns (email, phone, URL)
- Method chaining API
- Flag management system

## [1.0.2] - 2025-02-01

### Changed

- Updated TS config

### Fixed

- Fixed import issues

## [2.0.0] - 2025-02-01

### Added

- Changed to TS

## [2.0.1] - 2025-02-01

### Changed

- Change index and test file to ts

### Fixed

- `tslib` build issue

## [2.0.2] - 2025-02-01

### Changed

- Rollup config and tsconfig

### Fixed

- Declaration file for module

## [2.0.3] - 2025-02-01

### Changed

- Rollup config and tsconfig

### Fixed

- Declaration file for module

## [2.0.4] - 2025-02-02

### Added

- `anyCharacter` method and tests
- updated README

## [2.0.5] - 2025-02-02

### Added

- updated README

## [2.1.0] - 2025-02-06

### Added

- New method `.multiline()` to add the multiline flag.
- New method `.dotAll()` to add the dot-all flag.
- New method `.sticky()` to add the sticky flag.
- New method `.unicodeChar()` to match Unicode characters.
- New method `.unicodeDigit()` to match Unicode digits.
- New method `.unicodePunctuation()` to match Unicode punctuation.
- New method `.unicodeSymbol()` to match Unicode symbols.
- New method `.startCaptureGroup()` to start a capturing group.
- New method `.startNamedGroup("name")` to start a named capturing group.
- New method `.wordBoundary()` to add a word boundary assertion.
- New method `.nonWordBoundary()` to add a non-word boundary assertion.
- New method `.lazy()` to make the previous quantifier lazy.
- New method `.repeat(count)` to repeat the previous pattern exactly count times.
- New method `.nonWhitespace()` to match any non-whitespace character.
- New method `.notRange("aeiou")` to match any character not in the specified set.

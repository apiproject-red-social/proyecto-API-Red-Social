# 1. Use TypeScript for type safety

Date: 2025-09-29

## Status

2025-09-29 proposed

## Context

Node.js projects without static typing are prone to runtime type errors. As the codebase grows, it becomes harder to maintain and refactor safely. Strong typing is crucial for long-term maintainability and early error detection.

## Decision

Adopt TypeScript for the entire API codebase. All source files will be written in `.ts`, compiled to `.js` in ESM format, with strict type checking enabled.

## Consequences

- Compilation step (`tsc`) is now required before running in production.
- Static type checking prevents many runtime errors.
- Code becomes more self-documenting and maintainable.
- Contributors need familiarity with TypeScript and types.
- Improves IDE support (autocomplete, refactoring, and inline documentation).

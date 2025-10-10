# 4. Adopt Vitest over Jest

Date: 2025-09-30

## Status

2025-09-30 proposed

## Context

Jest has been the standard tool for testing in Node.js and TypeScript projects for years.
However:

- It faces friction with pure ESM and ts-jest.
- Its performance is slower than modern alternatives.
- Its ecosystem is beginning to be replaced by more lightweight solutions.

Vitest, developed by the Vite team:

- Supports ESM and TypeScript natively.
- Is much faster, powered by esbuild.
- Features modern integrations, mocks, and coverage.
- As of 2025, it is considered mature for production use.

## Decision

Adopt Vitest as the testing framework instead of Jest.

- We will use Vitest for unit tests and integration tests (with Supertest).
- Remove Jest dependencies (jest, ts-jest, @types/jest).
- Adjust package.json scripts and documentation.

## Consequences

- Simplified configuration (no more ts-jest hacks).
- A faster and more modern test runner.
- A slightly smaller ecosystem than Jest, but sufficient for our use case.
- The few existing tests must be migrated (minimal effort is expected)

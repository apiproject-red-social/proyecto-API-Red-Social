# 2. Use ESM modules instead of CommonJS

Date: 2025-09-29

## Status

2025-09-29 proposed

## Context

Node.js supports both CommonJS and ESM modules. CommonJS is legacy and does not provide native support for top-level `await`, import maps, or some modern tooling features. Future Node.js features and interoperability with TypeScript lean towards ESM.

## Decision

Adopt ESM (`"module": "ESNext"`) for all project modules. Update `tsconfig.json` and package.json accordingly. Use `.js` extension for compiled files and `.ts` for source.

## Consequences

- Imports/exports must follow ESM syntax (`import x from 'y'`, `export default z`).
- Some legacy packages may require `esm` interop or updates.
- Enables top-level `await` in future implementations.

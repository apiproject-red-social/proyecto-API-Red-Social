# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-09-29

### Added

- Initial project setup with TypeScript, Express, and ESM (`tsx` runtime).
- Global error handling with `AppError` and `errorHandler`.
- Logging with Winston and request logging middleware.
- API health check endpoint (`GET /`).
- Swagger setup for API documentation (structure in place).
- Code style enforcement with ESLint + Prettier.
- Git hooks with Husky and lint-staged.
- Commit message linting with Commitlint (Conventional Commits).
- Documentation: professional `README.md` and ADR-001 (use ESM instead of CommonJS).

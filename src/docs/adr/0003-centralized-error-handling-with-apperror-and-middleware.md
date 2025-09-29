# 3. Centralized error handling with AppError and middleware

Date: 2025-09-29

## Status

2025-09-29 proposed

## Context

Express.js routes can throw synchronous or asynchronous errors. Without centralized error handling, errors may be inconsistent and leak sensitive data. Logging errors manually in each controller is repetitive and error-prone.

## Decision

Implement a custom `AppError` class for operational errors. Create a global error-handling middleware (`errorHandler`) that distinguishes operational errors from programming bugs and formats responses appropriately for development vs production. Handle uncaught exceptions and unhandled promise rejections at the process level.

## Consequences

- Standardized API error responses.
- Centralized logging with Winston/Morgan.
- Safer production environment, no sensitive data leakage.
- Encourages consistent error handling in new features.

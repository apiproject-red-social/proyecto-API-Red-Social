# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 0.1.0 (2025-10-18)


### ✨ Features

* **core:** add global error handling and ESM setup with tsx ([9aaa05b](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/9aaa05b8bcf16e3b07f0133db1228ff22f4b3a00))


### 🧹 Chores

* **husky:** update to version 10 ([b102186](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/b102186683ed4667b2ff903647763073a955115d))
* initial project setup with tsconfig and package.json ([52d1b38](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/52d1b38001dd4fcd8399699d69ff2c3f4c6733b8))
* **security:** document lodash.template vulnerability via gulp-header ([08a45d2](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/08a45d24fc7b8e16b244d4d4e8238be263603b5e))


### 📝 Documentation

* add professional README with badges and project overview ([81490dd](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/81490dda9f506ac4fc07bc2f0671ba6f86164bda))
* **ADR:** add initial architectural decision about TypeScript ([a2ddb5b](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/a2ddb5b325644d5d3b2c5bdc991aa48172717274))
* **ADR:** adopt ESM modules for modern Node.js support ([a10f220](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/a10f220c96f09ce7d505190318757df48381db84))
* **ADR:** implement global error handling strategy ([12e0b60](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/12e0b605ad6ef24b4e4e1f2dc3b6538271b2cb57))
* **readme:** update README with ADRs, GitHub Flow, ESM & tsx setup ([f979389](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/f97938908cfdc065425b45bd4bfc5f488db2b2b4))
* **readme:** update README with ADRs, GitHub Flow, ESM & tsx setup ([d60a51c](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/d60a51c99b3986f49f0125a506b03228d14fc896))


### 🔧 Refactors

* **config:** improve environment management and logging system ([0152e65](https://github.com/apiproject-red-social/proyecto-API-Red-Social/commit/0152e65e6e268827b85758b1cea96c38a8b995ff))

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

# 🚀 Simple Microblogging API (TypeScript + Express)

![Build](https://img.shields.io/github/actions/workflow/status/apiproject-red-social/proyecto-API-Red-Social/ci.yml?branch=main&label=build&style=flat-square)
![Coverage](https://img.shields.io/codecov/c/github/apiproject-red-social/proyecto-API-Red-Social?label=coverage&style=flat-square)
![Lint](https://img.shields.io/github/actions/workflow/status/apiproject-red-social/proyecto-API-Red-Social/lint.yml?label=lint&style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square)

> A **production-ready REST API boilerplate** built with **TypeScript**, **Express**, and a **clean, modular architecture**.  
> Perfect foundation for a **junior backend portfolio** or as a base for scalable microservices.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ESM)
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js v5
- **Security:** Helmet, CORS
- **Logging:** Winston (persistent) + Morgan (HTTP requests)
- **Environment Management:** dotenv
- **Documentation:** Swagger (OpenAPI 3)
- **Error Handling:** Centralized via `AppError` + global `errorHandler`
- **Linting & Formatting:** ESLint + Prettier + Husky + lint-staged
- **Commits & Versioning:** Conventional Commits + Commitlint + standard-version
- **Testing:**
  - Unit: Vitest
  - Integration: Supertest
  - Coverage: c8 (V8 coverage engine)

---

## 📂 Project Structure

.
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .editorconfig
├── .prettierignore
├── commitlint.config.cjs
├── src
│ ├── api.ts # Express app configuration
│ ├── server.ts # Server bootstrap (env, logger, process errors)
│ ├── config/ # Logger, env, and app configuration
│ ├── controllers/ # Route handlers (controllers)
│ ├── middlewares/ # Error handling, notFound, logging
│ ├── routes/ # API route definitions
│ ├── schemas/ # Request validation (Zod - WIP)
│ ├── services/ # Business logic and orchestration
│ ├── models/ # Data models (DB integration - WIP)
│ ├── utils/ # AppError, helpers, constants
│ ├── docs/ # Swagger and ADRs
│ │ └── adr/ # Architecture Decision Records
│ └── types/ # Custom TypeScript definitions

---

## ⚙️ Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/apiproject-red-social/proyecto-API-Red-Social.git
cd proyecto-API-Red-Social

2️⃣ Install dependencies

npm install

3️⃣ Configure environment variables

Copy the example environment file:

cp .env.example .env.development

Edit it to fit your setup:

NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/dev_db
JWT_SECRET=devsecret123

    ⚠️ Never commit .env files!
    Keep only .env.example in version control.

4️⃣ Run in development mode

npm run dev

Runs with tsx (modern replacement for ts-node-dev).
Server available at → http://localhost:3000
📖 API Documentation

    Swagger docs available at: http://localhost:3000/api-docs

    Current endpoints:

        GET / → Health check

    More endpoints (users, posts, auth) coming soon.

🧪 Testing
Run all tests

npm test

Run with coverage

npm run coverage

This runs:

    Unit tests (Vitest)

    Integration tests (Supertest)

    Coverage reports via c8

🧭 Development Workflow

This project follows GitHub Flow and Conventional Commits.
Example workflow:

    Create a new branch:

git checkout -b feature/add-auth

Commit with proper conventions:

    feat(auth): add JWT authentication

    fix(routes): correct health check path

    chore(logger): improve error logging

    docs(adr): record ADR for error handling

Push and open a Pull Request:

    git push origin feature/add-auth

    After review → merge into main.

🔐 Commits & Changelog

    All commits follow the Conventional Commits specification.

    Releases and changelogs are generated automatically via standard-version.

🏛️ Architecture Decisions (ADRs)

All technical decisions are documented under:

src/docs/adr/

Examples:

    ADR-001: Use TypeScript for type safety

    ADR-002: Use ESM modules instead of CommonJS

    ADR-003: Centralized error handling with AppError

    ADR-004: Adopt GitHub Flow branching model

Each ADR should be committed with a docs(adr): prefix and reviewed like code.
🧱 Current Status

✅ Implemented:

    TypeScript + Express base architecture

    Centralized error handling (AppError, errorHandler)

    Logging with Winston & Morgan

    Code linting, formatting, and commit validation

    Unit and integration testing setup

🚧 Planned Next:

    Database integration (MongoDB / Prisma)

    Authentication (JWT)

    Request validation (Zod)

    CI/CD (GitHub Actions + Codecov)

    Load testing (k6)

    Security scanning (OWASP ZAP)

    ADR-based governance automation

⚙️ CI/CD (Preview)

This project will integrate a full open-source CI/CD stack:
Type	Tool	Purpose
CI	GitHub Actions	Build, test, lint, coverage
Coverage	Codecov	Track test coverage
Load testing	k6	Performance and stress testing
Security testing	OWASP ZAP	Basic vulnerability scanning
Lint & Style	ESLint + Prettier	Code quality checks
Conventional commits	Commitlint + Husky	Commit validation
🧠 Summary

    A clean, scalable and professional Express + TypeScript API boilerplate,
    featuring logging, error handling, testing, and CI/CD integration —
    ideal for showcasing modern backend engineering practices in a junior developer portfolio.

📄 License

Licensed under the MIT License.
See the LICENSE file for details.

```

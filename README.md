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
- **Environment Management:** dotenv + Zod schema validation
- **Documentation:** Swagger (OpenAPI 3)
- **Error Handling:** Centralized via `AppError` + global `errorHandler`
- **Linting & Formatting:** ESLint + Prettier + Husky + lint-staged
- **Commits & Versioning:** Conventional Commits + Commitlint + commit-and-tag-version _(replaces deprecated standard-version)_
- **Testing:**
  - Unit: Vitest
  - Integration: Supertest
  - Coverage: c8 (V8 coverage engine)

---

## 🧩 Technical Rationale

Each technology in this boilerplate was deliberately chosen to balance **developer experience**, **maintainability**, and **production readiness**:

- **TypeScript** → Ensures static typing, better IDE support, and early error detection for safer refactors.
- **Express.js v5** → Mature, minimal, and flexible — perfect for building REST APIs without unnecessary overhead.
- **ESM + tsx** → Embraces the modern JavaScript module standard; `tsx` enables fast TypeScript execution without separate builds.
- **Zod** → Provides both runtime validation and static typing, unifying schema validation and type safety.
- **Winston + Morgan** → Combines persistent structured logging (`Winston`) with clean HTTP request logs (`Morgan`).
- **dotenv + Zod validation** → Safely manages environment variables across different environments (dev/test/prod).
- **Vitest + Supertest + c8** → Modern testing stack ensuring high coverage and fast feedback loops.
- **ESLint + Prettier + Husky + lint-staged** → Enforces consistent style and prevents bad commits before they hit the repo.
- **Commitlint + commit-and-tag-version** → Enforces semantic commits and automates changelogs/releases.
- **Swagger (OpenAPI)** → Standardized documentation for consumers and automated client generation.

> 🎯 The goal is to provide a clean, educational yet production-ready structure — teaching **real-world backend standards** while remaining approachable for junior developers.

---

## 📂 Project Structure

```

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
│ ├── config/
│ │ ├── env.ts # Environment validation with Zod
│ │ └── logger.ts # Winston logger setup
│ ├── middlewares/
│ │ ├── errorHandler.ts # Centralized error handling
│ │ └── notFoundHandler.ts
│ ├── utils/ # AppError, helpers, constants
│ ├── docs/
│ │ └── adr/ # Architecture Decision Records
│ └── **tests**/ # Unit and integration tests

```

---

# ⚙️ Setup – Local Development, Test & Development

## 1️⃣ Clonar el repositorio

Clona el proyecto desde GitHub y entra en la carpeta del proyecto:

```bash
git clone https://github.com/apiproject-red-social/proyecto-API-Red-Social.git
cd proyecto-API-Red-Social
```

---

## 2️⃣ Instalar dependencias

Instala todas las dependencias de Node.js necesarias:

```bash
npm install
```

> Esto instalará:
>
> * TypeScript, tsx, Express
> * Prisma y cliente de PostgreSQL
> * Redis client
> * Vitest y Supertest para testing
> * ESLint / Prettier para calidad de código

---

## 3️⃣ Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env.development
cp .env.example .env.test
```

### 🔹 Variables principales

Edita `.env.development` para desarrollo local:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/dev_db
JWT_ACCESS_SECRET=devsecret123
JWT_REFRESH_SECRET=devsecret123
REDIS_URL=redis://127.0.0.1:6379
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microblog_dev?schema=public
```

Edita `.env.test` para ejecutar tests:

```env
NODE_ENV=test
PORT=3001
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/test_db
JWT_ACCESS_SECRET=testsecret
JWT_REFRESH_SECRET=testsecret
REDIS_URL=redis://127.0.0.1:6379
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microblog_test?schema=public
```

> ⚠️ Nunca comitear `.env` reales. Solo mantener `.env.example` en el repositorio.

---

## 4️⃣ Crear base de datos de desarrollo y test

Asegúrate de que PostgreSQL esté corriendo y crea las bases de datos:

```sql
-- Para desarrollo
CREATE DATABASE microblog_dev;

-- Para tests
CREATE DATABASE microblog_test;
```

> Alternativamente, puedes levantar PostgreSQL con Docker usando `docker-compose.yml`.

---

## 5️⃣ Ejecutar migraciones y generar Prisma Client

Esto sincroniza tu esquema de Prisma con la base de datos:

```bash
# Migrar y crear Prisma Client en desarrollo
npx prisma migrate dev --name init

# Generar Prisma Client (si no lo hizo la migración)
npx prisma generate
```

Para tests (opcional):

```bash
NODE_ENV=test npx prisma migrate deploy
```

---

## 6️⃣ Levantar servidor en modo desarrollo

```bash
npm run dev
```

* El servidor estará disponible en: [http://localhost:3000](http://localhost:3000)
* Utiliza **tsx** para compilar TypeScript al vuelo
* Los cambios en código se reflejan automáticamente

---

## 7️⃣ Acceder a Swagger / documentación de API

Swagger está disponible en:

```
http://localhost:3000/api-docs
```

* Aquí se pueden ver todos los endpoints disponibles
* Incluye **Users, Auth y Health**
* Permite probar endpoints directamente desde el navegador

---

## 8️⃣ Ejecutar tests

### 🔹 Tests unitarios e integración

```bash
# Ejecutar todos los tests
NODE_ENV=test npx vitest run
```

* Los tests usarán `.env.test`
* La base de datos de test (`microblog_test`) se limpia automáticamente antes y después de cada suite
* Cobertura mínima académica incluida

### 🔹 Reporte de cobertura

```bash
npm run coverage
```

* Genera reporte con **c8**
* Ideal para cumplir con RFN-MAN-001 (cobertura > 80%)

---

## 9️⃣ Desarrollo guiado / flujo académico

Este proyecto sigue **GitHub Flow** y **Conventional Commits**.

### 🔹 Flujo recomendado

1. Crear rama para nueva funcionalidad:

```bash
git checkout -b feature/add-users
```

2. Hacer cambios y commitear siguiendo Conventional Commits:

```
feat(users): add user registration endpoint
fix(users): correct profile response
chore(tests): add integration test for /users/me
docs(adr): document choice of Prisma for DB
```

3. Abrir **Pull Request** (no hacer merge directamente). Usar formato académico de PR:

```markdown
## ✨ Feature Summary
_Example_: Adds `/users` endpoints with registration and profile

## 🧩 Changes Made
- Created new route /users
- Added controller and schema validation
- Added integration tests

## ✅ Checklist
- [ ] Code builds and lints without errors
- [ ] Tests pass
- [ ] Swagger / README updated

## 🧪 How to Test
1. Run dev server
2. Test endpoints manually or run automated tests
```

4. Revisar, aprobar y mergear después de feedback

---

Push and open a Pull Request:

```bash
git push origin feature/add-auth
```

After review → merge into `main`.

---

## 🔐 Commits & Changelog

- All commits follow the **Conventional Commits** specification.
- Releases and changelogs are generated automatically via **commit-and-tag-version**.

---

## 🏛️ Architecture Decisions (ADRs)

All technical decisions are documented under:

```
src/docs/adr/
```

Examples:

- ADR-001: Use TypeScript for type safety
- ADR-002: Use ESM modules instead of CommonJS
- ADR-003: Centralized error handling with AppError
- ADR-004: Adopt GitHub Flow branching model

Each ADR should be committed with a `docs(adr):` prefix and reviewed like code.

---

## 🧱 Current Status

✅ Implemented:

- TypeScript + Express base architecture
- Centralized error handling (AppError, errorHandler)
- Logging with Winston & Morgan (file + console)
- Environment validation with Zod
- Code linting, formatting, and commit validation
- Unit and integration testing setup

🚧 Planned Next:

- Database integration (MongoDB / Prisma)
- Authentication (JWT)
- Request validation (Zod schemas for routes)
- CI/CD (GitHub Actions + Codecov)
- Load testing (k6)
- Security scanning (OWASP ZAP)
- ADR-based governance automation

---

## ⚙️ CI/CD (Preview)

| Type                 | Tool               | Purpose                        |
| -------------------- | ------------------ | ------------------------------ |
| CI                   | GitHub Actions     | Build, test, lint, coverage    |
| Coverage             | Codecov            | Track test coverage            |
| Load testing         | k6                 | Performance and stress testing |
| Security testing     | OWASP ZAP          | Basic vulnerability scanning   |
| Lint & Style         | ESLint + Prettier  | Code quality checks            |
| Conventional commits | Commitlint + Husky | Commit validation              |

---

## 🧠 Summary

A **clean, scalable and professional Express + TypeScript API boilerplate**,
featuring logging, error handling, environment validation, testing, and CI/CD integration —
ideal for showcasing **modern backend engineering practices** in a junior developer portfolio.

---

## 🔒 Security Notes

- **Reported Vulnerability:** `lodash.template` (high severity) via `gulp-header`
- **Description:** Command injection vulnerability in a dev dependency (`gulp-header`).
  It does **not** affect production runtime or API endpoints.
- **Mitigation:**
  - Monitor future releases of `gulp-header` and `lodash.template`.
  - Apply `npm audit fix` periodically.

- **Current Status:** Logged for awareness; no production impact.

---

📄 **License**

Licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

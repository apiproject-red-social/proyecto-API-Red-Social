# 📌 README.md

# 🚀 Simple Microblogging API (TypeScript + Express)

A production-ready **REST API boilerplate** for building a simple microblogging / social network backend.  
Built with **TypeScript**, **Express**, and following **clean, modular architecture** with strict coding standards.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ESM)
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js (v5)
- **Security**: Helmet, CORS
- **Logging**: Winston (persistent) + Morgan (HTTP logging)
- **Environment Management**: dotenv
- **Documentation**: Swagger (OpenAPI 3)
- **Linting/Formatting**: ESLint + Prettier + Husky + lint-staged
- **Commits**: Conventional Commits + Commitlint
- **Testing**:
  - Unit: Jest
  - Integration: Supertest
  - Coverage: NYC
- **Error Handling**: Centralized with `AppError` + global `errorHandler`

---

## 📂 Project Structure

```

.
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .editorconfig
├── .prettierignore
├── commitlint.config.cjs
├── jest.config.js
├── src
│   ├── api.ts            # Express app configuration
│   ├── server.ts         # Server bootstrap (env, logger, process errors)
│   ├── config/           # Logger, env config
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Error handling, logging, notFound
│   ├── routes/           # API routes
│   ├── schemas/          # Request validation (Zod/Yup - WIP)
│   ├── services/         # Business logic
│   ├── models/           # Data models (DB - WIP)
│   ├── utils/            # AppError, helpers
│   ├── docs/             # Swagger, ADRs
│   │   └── adr/          # Architecture Decision Records
│   └── types/            # Custom TS types

```

---

## ⚙️ Setup

### 1. Clone repository
```bash
git clone https://github.com/<your-org>/api-ts-prueba-i
cd api-ts-prueba-i
````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to your desired environment:

```bash
cp .env.example .env.development
```

Edit values as needed:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/dev_db
JWT_SECRET=devsecret123
```

> ⚠️ **Do not commit `.env.*` files**. Only share `.env.example`.

### 4. Run in development

```bash
npm run dev
```

Runs with **tsx** (modern replacement for ts-node-dev).
Server available at: [http://localhost:3000](http://localhost:3000)

---

## 📖 API Documentation

* Swagger docs available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* Current endpoints:

  * `GET /` → Health check
  * More coming soon...

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run with coverage:

```bash
npm run test -- --coverage
```

---

## 📝 Development Workflow

This project follows **GitHub Flow**:

1. Create a branch:

   ```bash
   git checkout -b feature/your-feature
   ```
2. Make commits using **Conventional Commits**:

   * `feat(auth): add login endpoint`
   * `fix(routes): correct health route`
   * `chore(deps): update express`
   * `docs(ADR): add ADR-004 decision title`  ← ADRs follow same flow
3. Push your branch:

   ```bash
   git push origin feature/your-feature
   ```
4. Open a **Pull Request** → review → merge into `main`.

---

## 🔐 Commits & Changelog

* Commits follow the **Conventional Commits** spec.
* Releases and `CHANGELOG.md` are generated automatically with **standard-version**.

---

## 🏛️ Architecture Decisions (ADRs)

Important technical decisions are recorded as **ADRs** under:

```
src/docs/adr/
```

Examples:

* ADR-001: Use TypeScript for type safety
* ADR-002: Use ESM modules instead of CommonJS
* ADR-003: Centralized error handling with AppError and middleware
* ADR-004: GitHub Flow branching strategy

> Each new architectural decision should follow the same **GitHub Flow + Conventional Commits** pattern.

---

## 📌 Next Steps (Roadmap)

* [ ] Setup CI/CD (GitHub Actions)
* [ ] Add database integration (MongoDB / Prisma)
* [ ] Implement authentication (JWT)
* [ ] Expand endpoints (posts, users, likes)
* [ ] Add request validation (Zod)
* [ ] Improve test coverage
* [ ] Integrate ADR checks in CI/CD

---

## 📄 License

MIT

# 🚀 Microblogging API — Demo Guide

**TypeScript · Express · PostgreSQL · Redis · Docker**

![Build](https://img.shields.io/github/actions/workflow/status/apiproject-red-social/proyecto-API-Red-Social/ci.yml?branch=main)
![Coverage](https://img.shields.io/codecov/c/github/apiproject-red-social/proyecto-API-Red-Social)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)

This repository contains a REST API for a simple microblogging platform.
The project is designed to be **easily executed in a demo environment** using Docker, without requiring complex configuration.

The demo setup is **self-contained** and intended for evaluation, testing, and exploration of the API features.

---

## 🧠 Project Overview

The application exposes a RESTful API that supports:

- User registration and authentication (JWT)
- Creating, updating and deleting posts
- Commenting on posts
- Liking and unliking posts
- Basic health checks
- Interactive API documentation (Swagger)

The focus of the project is **backend architecture clarity**, not frontend complexity.

---

## 🛠️ Requirements

To run the demo, the following tools are required:

- **Git**
- **Docker** (Docker Desktop or Docker Engine with Docker Compose)
- **Make** (optional, recommended for convenience)

No local installation of Node.js, PostgreSQL or Redis is required.

---

## 📥 Getting the Project

Clone the repository and access the project folder:

```bash
git clone https://github.com/apiproject-red-social/proyecto-API-Red-Social
cd proyecto-API-Red-Social
```

---

## ⚙️ Environment Variables (Optional)

The demo environment **does not require** a `.env` file to run.

All required variables have **safe default values** defined directly in the Docker Compose configuration.

Optionally, a `.env` file can be created from the example to customize values such as the exposed port or secrets:

```bash
cp .env.example .env
```

If no `.env` file is provided, the application will run using default values (including port `3000`).

---

## 🚀 Running the Demo

### Using the Makefile (recommended)

The simplest way to start the demo is:

```bash
make demo
```

This command will:

- Build the production-ready Docker image
- Start the API, PostgreSQL and Redis containers
- Initialize the database schema
- Load demo data automatically

By default, the application will be available at:

```
http://localhost:3000
```

---

### Without Makefile (manual Docker command)

If you prefer not to use `make`, the demo can be started directly with Docker Compose:

```bash
docker compose -f compose.demo.yml up --build
```

---

## 🧪 How to Try the Demo

Once the services are running:

- **Web client (embedded demo UI):**

  ```
  http://localhost:3000
  ```

- **API documentation (Swagger):**

  ```
  http://localhost:3000/api-docs
  ```

The embedded client allows basic interaction with the system (authentication, posting, liking and commenting) without external tools.
Swagger can be used to inspect and manually test all API endpoints.

---

## 🧰 Development & Tooling Stack (Overview)

This project uses a modern backend stack and development workflow, including:

- **TypeScript** (strict mode)
- **Express**
- **Prisma ORM** with PostgreSQL
- **Redis**
- **Docker & Docker Compose**
- **Vitest** and **Supertest** for testing
- **Test coverage** reporting
- **GitHub Actions** for CI
- **ESLint** for static analysis
- **Commitlint** and **Husky** for commit quality enforcement

These tools support code quality, consistency, and automated validation, while keeping the demo setup simple.

---

## 🌍 Other Environments (Brief)

In addition to the demo environment, the project also includes configurations for:

- **Development** (hot reload, local iteration)
- **Testing** (isolated containers, ephemeral database)
- **Production** (persistent data and externalized configuration)

These environments are out of scope for this demo guide and are documented separately.

---

## 📄 License

MIT License
Academic and educational use permitted.

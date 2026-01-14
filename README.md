# 🚀 Simple Microblogging API

**TypeScript · Express · PostgreSQL · Redis · Docker**

![Build](https://img.shields.io/github/actions/workflow/status/apiproject-red-social/proyecto-API-Red-Social/ci.yml?branch=main)
![Coverage](https://img.shields.io/codecov/c/github/apiproject-red-social/proyecto-API-Red-Social)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)

> API REST para una **plataforma de microblogging**, diseñada con una arquitectura clara, tecnologías actuales y preparada para **desarrollo, testing y despliegue en contenedores**.
> Pensada como proyecto académico y base sólida de backend profesional.

---

## 🧠 Objetivo del proyecto

Este proyecto demuestra **cómo se estructura y despliega una API moderna** usando:

* separación clara de responsabilidades
* base de datos relacional
* caché con Redis
* variables de entorno por entorno
* contenerización con Docker
* testing automatizado

El foco está en **el flujo de peticiones**, no en detalles internos complejos.

---

## 🛠️ Tecnologías utilizadas

### Backend

* **Node.js** (ESM)
* **TypeScript** (modo estricto)
* **Express.js v5**

### Persistencia y datos

* **PostgreSQL** → base de datos principal
* **Prisma ORM** → acceso tipado a la base de datos
* **Redis** → caché y soporte a autenticación

### Seguridad y utilidades

* JWT (access + refresh)
* Helmet, CORS
* Zod (validación de datos y variables de entorno)

### Observabilidad

* Winston (logs persistentes)
* Morgan (logs HTTP)

### Testing

* Vitest (unitarios)
* Supertest (integración)
* Coverage con V8

### DevOps / Infraestructura

* Docker & Docker Compose
* Entornos: development, test, production
* GitHub Actions + Codecov
* Conventional Commits

---

## 📂 Estructura del proyecto

```
.
├── src
│   ├── server.ts        # Arranque del servidor
│   ├── api.ts           # Configuración de Express
│   ├── routes/          # Rutas HTTP
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Auth, errores, validación
│   ├── config/          # Env, logger, JWT
│   ├── utils/           # AppError, helpers
│   └── docs/adr/        # Decisiones de arquitectura
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose*.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## 🔁 Flujo general de la aplicación (simplificado)

1. **Cliente** realiza una petición HTTP
2. **API (Express)** recibe la petición
3. Middlewares validan:

   * datos (Zod)
   * autenticación (JWT)
4. **Controlador** ejecuta la lógica
5. Acceso a:

   * **PostgreSQL** (Prisma)
   * **Redis** (caché / tokens)
6. Respuesta HTTP al cliente

> No se expone la base de datos ni Redis directamente al exterior.

---

## ⚙️ Configuración por entornos

El proyecto soporta **tres entornos claramente separados**:

| Entorno     | Uso               | Características                      |
| ----------- | ----------------- | ------------------------------------ |
| Development | Desarrollo local  | Hot reload, datos persistentes       |
| Test        | Tests automáticos | BD efímera                           |
| Production  | Despliegue        | Build compilado + datos persistentes |

Cada entorno tiene su propio `.env`.

---

## 🧪 Variables de entorno (ejemplo)

### Desarrollo (`.env.development`)

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microblog_dev
REDIS_URL=redis://127.0.0.1:6379

JWT_ACCESS_SECRET=dev_access_secret
JWT_REFRESH_SECRET=dev_refresh_secret
```

### Test (`.env.test`)

```env
NODE_ENV=test
PORT=3001

DATABASE_URL=postgresql://postgres:postgres@postgres-test:5432/microblog_test
REDIS_URL=redis://redis-test:6379

JWT_ACCESS_SECRET=test_secret
JWT_REFRESH_SECRET=test_secret
```

---

## 🐳 Contenerización con Docker

### Servicios principales

* `api` → servidor Node.js
* `postgres` → base de datos
* `redis` → caché
* Volúmenes persistentes en dev/prod
* Base de datos **efímera en test**

### Arrancar en desarrollo (Docker)

```bash
docker compose up --build
```

La API queda accesible en:

```
http://localhost:3000
```

---

## 🧪 Tests

### Local

```bash
npm test
```

### En Docker (entorno aislado)

```bash
make test-docker
```

* Usa base de datos temporal
* No afecta a desarrollo ni producción

---

## 📘 Documentación API (Swagger)

Disponible en:

```
http://localhost:3000/api-docs
```

Permite:

* ver endpoints
* probar peticiones
* revisar modelos y respuestas

---

## 🏛️ Decisiones de arquitectura (ADR)

Todas las decisiones técnicas están documentadas en:

```
src/docs/adr/
```

Ejemplos:

* Uso de PostgreSQL frente a NoSQL
* Prisma como ORM
* Redis para caché y tokens
* Docker para aislamiento por entorno

---

## 📌 Estado actual

### Implementado

* API REST funcional
* PostgreSQL + Prisma
* Redis
* JWT
* Docker (dev / test / prod)
* Testing automatizado
* CI básico

### Fuera de alcance (intencionado)

* Microservicios
* Orquestadores complejos
* Mensajería distribuida

> El objetivo es **claridad arquitectónica**, no complejidad innecesaria.

---

## 📄 Licencia

MIT License
Uso académico y educativo permitido.

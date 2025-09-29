# 🚀 API TS Red Social

![Node.js](https://img.shields.io/badge/Node.js-ES2022-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![Build](https://img.shields.io/github/actions/workflow/status/angeldev/api-ts-prueba-i/build.yml?branch=main)
![Lint](https://img.shields.io/github/actions/workflow/status/angeldev/api-ts-prueba-i/lint.yml?branch=main)
![Tests](https://img.shields.io/github/actions/workflow/status/angeldev/api-ts-prueba-i/test.yml?branch=main)
![Coverage](https://img.shields.io/badge/Coverage-0%25-lightgrey)
![Commitlint](https://img.shields.io/badge/Commitlint-Conventional-brightgreen)

API de prueba construida con **Node.js**, **Express 5**, **TypeScript** y un stack profesional.  
Incluye manejo de errores centralizado, logging avanzado, documentación Swagger y setup para testing.

---

## 📂 Estructura del Proyecto

├── src
│ ├── config/ # Configuración global (logger, env, etc.)
│ ├── docs/ # Documentación Swagger
│ ├── middlewares/ # Middlewares (errorHandler, notFound, morganLogger)
│ ├── routes/ # Rutas (ej: health check)
│ ├── utils/ # Utilidades (AppError, helpers)
│ ├── types/ # Tipados adicionales
│ ├── api.ts # Configuración de Express
│ └── server.ts # Entry point del servidor
├── tests/ # Tests (Jest + Supertest + Chai + Mocha)
├── dist/ # Código compilado (build)


---

## ⚙️ Tecnologías y Librerías Clave

- **Runtime**: Node.js (ESM con [`tsx`](https://github.com/esbuild-kit/tsx))  
- **Framework**: Express 5  
- **Lenguaje**: TypeScript  
- **Seguridad**: Helmet, CORS  
- **Logging**: Winston, Morgan  
- **Documentación**: Swagger (`swagger-jsdoc`, `swagger-ui-express`)  
- **Testing**: Jest, Supertest, Mocha, Chai, NYC  
- **Estilo y Git**: ESLint, Prettier, Husky, Commitlint

---

## 🚦 Scripts Disponibles

| Comando                | Descripción                                   |
|-------------------------|-----------------------------------------------|
| `npm run dev`           | Levanta el servidor en modo desarrollo (tsx) |
| `npm run build`         | Compila TypeScript a JavaScript (dist)       |
| `npm start`             | Corre la versión compilada (producción)      |
| `npm run lint`          | Corre ESLint sobre el código                 |
| `npm run format`        | Formatea con Prettier                        |
| `npm test`              | Corre los tests                              |

---

## 🧰 Manejo de Errores

- `AppError`: clase personalizada para errores operacionales.  
- `errorHandler`: middleware global que distingue entre **desarrollo** y **producción**.  
- Handlers de proceso (`uncaughtException`, `unhandledRejection`) para evitar caídas inesperadas.

---

## 📖 Documentación Swagger

Swagger interactivo disponible en:


---

## 🧪 Testing

- Unit tests: Jest  
- Integration tests: Supertest  
- Assertions: Chai  
- Cobertura: NYC  


npm test

---

## 🔮 Roadmap

* [ ] Autenticación y autorización (JWT)
* [ ] CI/CD con GitHub Actions
* [ ] Dockerización
* [ ] Base de datos (MongoDB)
* [ ] Tests E2E
* [ ] Deploy en un PaaS (Render, Railway, Heroku, Vercel)

---

## 👨‍💻 Contribución

1. Haz fork del repositorio
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit siguiendo convención (`feat(core): descripción`)
4. Push (`git push origin feature/nueva-feature`)
5. Abre un Pull Request 🚀

---

## 📜 Licencia

[MIT](./LICENSE)

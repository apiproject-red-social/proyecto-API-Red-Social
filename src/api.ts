import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';
import { setupSwagger } from './docs/swagger.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath =
  env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../public')
    : path.resolve(process.cwd(), 'public');

const app = express();

console.log(`📂 [${env.NODE_ENV.toUpperCase()}] Sirviendo frontend desde: ${publicPath}`);

// 1. Configuración de Seguridad
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdn.tailwindcss.com',
        ],
        imgSrc: ["'self'", 'data:', 'https://*'],
        connectSrc: ["'self'", '*'],
      },
    },
  }),
);

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cookieParser());

// 2. DOCUMENTACIÓN SWAGGER
setupSwagger(app);

// 3. ARCHIVOS ESTÁTICOS
app.use(express.static(publicPath));

// 4. RUTAS DE LA API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', healthRouter);

// 5. SOPORTE PARA SPA (CORREGIDO PARA TESTS Y PRODUCCIÓN)
/** * Lógica de filtrado inteligente:
 * Si la petición es para la API o no pide explícitamente HTML, la dejamos pasar.
 * Esto permite que el NotFoundHandler devuelva 404 en lugar de 200 con el index.html.
 */
app.use((req, res, next) => {
  // Solo interceptamos GET
  if (req.method !== 'GET') return next();

  // Si es API o Swagger, no es para el frontend
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }

  // Si NO es una petición de un navegador (Accept: text/html), la dejamos pasar al 404
  // Esto arregla el test que esperaba 404 y recibía 200
  const acceptsHtml = req.headers.accept?.includes('text/html');
  if (!acceptsHtml && req.path !== '/') {
    return next();
  }

  // Para todo lo demás (navegación real), enviamos el frontend
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 6. MANEJO DE ERRORES
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

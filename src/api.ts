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
    ? path.resolve(__dirname, '../public') // En prod (dist/public)
    : path.resolve(process.cwd(), 'public'); // En dev (raiz/public)

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

// 5. SOPORTE PARA SPA (SOLUCIÓN DEFINITIVA PARA EXPRESS 5)
/** * Usamos app.use sin ruta. Esto intercepta CUALQUIER petición que llegue a este punto.
 * Como no hay cadena de texto (string path), no hay error de PathError.
 */
app.use((req, res, next) => {
  // Solo queremos manejar peticiones GET (navegación del navegador)
  if (req.method !== 'GET') return next();

  // Si la ruta empieza por api o api-docs, no enviamos el HTML (dejamos que llegue al 404)
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }

  // Para todo lo demás, servimos el index.html del frontend
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 6. MANEJO DE ERRORES
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

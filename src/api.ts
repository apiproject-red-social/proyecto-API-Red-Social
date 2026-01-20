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

setupSwagger(app);

app.use(express.static(publicPath));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', healthRouter);

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }

  const acceptsHtml = req.headers.accept?.includes('text/html');
  if (!acceptsHtml && req.path !== '/') {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

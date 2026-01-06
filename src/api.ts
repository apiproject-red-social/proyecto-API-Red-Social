import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';
import { setupSwagger } from './docs/swagger.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import { client, restResponseTimeHistogram } from './utils/metrics.js';

const app = express();

// Middlewares

// Middleware de Observabilidad
app.use((req, res, next) => {
  const start = process.hrtime(); // Mayor precisión que Date.now()

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9; // Convertir a segundos

    // Solo logueamos si la ruta existe para evitar polución de datos
    const route = req.route ? req.route.path : req.path;

    restResponseTimeHistogram
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
  });

  next();
});

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cookieParser());

// Endpoint público para la demo y para que lo lea Prometheus
app.get('/api/v1/metrics', async (_req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
// Health check
app.use('/api/v1', healthRouter);

// Base API route (we will add routers later)
app.use('/api/v1', express.Router());

setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

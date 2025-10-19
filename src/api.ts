import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Health check
app.use('/api/v1', healthRouter);

// Base API route (we will add routers later)
app.use('/api/v1', express.Router());

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

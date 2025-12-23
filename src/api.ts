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

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(cookieParser());

app.use('/auth', authRoutes);
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

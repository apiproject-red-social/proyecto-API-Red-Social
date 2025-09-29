import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running 🚀' });
});

// Base API route (we will add routers later)
app.use('/api/v1', express.Router());

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

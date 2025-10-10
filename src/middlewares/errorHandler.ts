import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

const errorHandlers: Record<string, (err: any) => AppError> = {
  CastError: (err) => new AppError(`Invalid ${err.path}: ${err.value}.`, 400),
  ValidationError: (err) => {
    const errors = Object.values(err.errors || {}).map((e: any) => e.message);
    return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
  },
  JsonWebTokenError: () => new AppError('Invalid token. Please log in again.', 401),
  TokenExpiredError: () => new AppError('Your token has expired. Please log in again.', 401),
};

const sendError = (err: AppError, res: Response, env: string) => {
  const payload = {
    status: err.status,
    message: err.message,
    ...(env === 'development' && { stack: err.stack }),
  };
  res.status(err.statusCode).json(payload);
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const env = process.env.NODE_ENV || 'development';
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err && typeof err === 'object' && 'name' in err) {
    const handler = errorHandlers[(err as any).name];
    error = handler
      ? handler(err)
      : new AppError((err as any).message || 'Internal Server Error', 500);
  } else {
    error = new AppError('Internal Server Error', 500);
  }

  if (env !== 'test' && (!error.isOperational || env === 'development')) {
    logger.error('💥 ERROR', { message: error.message, stack: error.stack });
  }

  sendError(error, res, env);
};

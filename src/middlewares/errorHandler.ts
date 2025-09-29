import { Request, Response } from 'express';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

// --- Helpers for known errors ---
const handleCastErrorDB = (err: any): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.keyValue ? JSON.stringify(err.keyValue) : 'duplicate value';
  return new AppError(`Duplicate field value: ${value}. Please use another value.`, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};

const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired. Please log in again.', 401);

// --- Senders ---
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    logger.error('💥 UNEXPECTED ERROR', { message: err.message, stack: err.stack });
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong.',
    });
  }
};

// --- Global Error Handler ---
export const errorHandler = (err: any, _req: Request, res: Response): void => {
  let error: AppError;

  if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    else if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    else if (err.name === 'JsonWebTokenError') error = handleJWTError();
    else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    else error = new AppError(err.message || 'Internal Server Error', err.statusCode || 500);
  } else {
    error = err instanceof AppError ? err : new AppError(err.message, 500);
  }

  if (process.env.NODE_ENV === 'development') sendErrorDev(error, res);
  else sendErrorProd(error, res);
};

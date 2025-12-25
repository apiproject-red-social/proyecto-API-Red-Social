import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

// Manejadores para errores de librerías externas (Mongoose, JWT, etc.)
const errorHandlers: Record<string, (err: any) => AppError> = {
  CastError: (err) => new AppError(`Invalid ${err.path}: ${err.value}.`, 400),
  ValidationError: (err) => {
    const errors = Object.values(err.errors || {}).map((e: any) => e.message);
    return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
  },
  JsonWebTokenError: () => new AppError('Invalid token. Please log in again.', 401),
  TokenExpiredError: () => new AppError('Your token has expired. Please log in again.', 401),
};

// Manejador específico para errores de Prisma
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return new AppError(`Duplicate field value: ${target}. Please use another value!`, 400);
    }
    case 'P2025':
      return new AppError('Record not found.', 404);
    default:
      return new AppError(`Database error: ${err.message}`, 500);
  }
};

// Manejador específico para errores de validación de Zod
const handleZodError = (err: ZodError): AppError => {
  const errors = err.issues.map((issue) => issue.message).join(', ');
  return new AppError(`Validation error: ${errors}`, 400);
};

const sendError = (err: AppError, res: Response, env: string) => {
  // FUERZA el log en consola durante los tests para ver qué está pasando realmente
  if (process.env.NODE_ENV === 'test') {
    console.error('DEBUG TEST ERROR:', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    });
  }

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

  // 1. Identificar el tipo de error y transformarlo a AppError
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof ZodError) {
    error = handleZodError(err);
  } else if (err && typeof err === 'object' && 'name' in err) {
    const handler = errorHandlers[(err as any).name];
    error = handler
      ? handler(err)
      : new AppError((err as any).message || 'Internal Server Error', 500);
  } else {
    error = new AppError('Internal Server Error', 500);
  }

  // 2. Logging (No logueamos en test a menos que sea error crítico)
  if (env !== 'test' && (!error.isOperational || env === 'development')) {
    logger.error('💥 ERROR', {
      message: error.message,
      stack: (err as Error).stack,
    });
  }

  // 3. Enviar respuesta
  sendError(error, res, env);
};

import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import AppError from '../utils/AppError.js';

export const validate =
  (schema: ZodType<any>) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body || {}, // Aseguramos objeto vacío si no hay body
      params: req.params || {},
      query: req.query || {},
    });

    if (!result.success) {
      // Usamos result.error.issues que es el estándar de Zod
      const errorMessages = result.error.issues.map((issue) => issue.message).join(', ');
      console.log(result.error);
      next(new AppError(`Validation error: ${errorMessages}`, 400));
      return;
    }

    next();
  };

import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
};

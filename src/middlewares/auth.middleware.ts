import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.sendStatus(401);
  }
};

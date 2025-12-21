import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import AppError from '../utils/AppError.js';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getOwnProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await userService.getUserById(req.user.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

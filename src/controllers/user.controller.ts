import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import AppError from '../utils/AppError.js';
import { redis } from '../lib/redis.js';

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

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // 1. Borrar de Redis PRIMERO (para invalidar sesiones activas)
    await redis.del(`refresh:${userId}`);

    // 2. Borrar de la DB (Prisma se encarga de posts/comments por el Cascade)
    await userService.deleteUser(userId);

    // 3. Limpiar cookies del navegador
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { username, email } = req.body;

    const updatedUser = await userService.updateUser(userId, { username, email });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    await userService.updatePassword(userId, currentPassword, newPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

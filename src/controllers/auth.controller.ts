import { Request, Response } from 'express';
import { redis } from '../lib/redis.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const payload = { userId: user.id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    await redis.set(`refresh:${user.id}`, refreshToken);

    return res
      .status(201)
      .cookie('accessToken', accessToken, COOKIE_OPTIONS)
      .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
      .json({
        message: 'User created successfully',
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await redis.set(`refresh:${user.id}`, refreshToken);

    return res
      .cookie('accessToken', accessToken, COOKIE_OPTIONS)
      .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
      .json({
        message: 'Logged in',
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Aquí es donde usamos 'verifyRefreshToken'
    const payload = verifyRefreshToken(token);
    const stored = await redis.get(`refresh:${payload.userId}`);

    if (stored !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken({ userId: payload.userId });

    return res
      .cookie('accessToken', newAccessToken, COOKIE_OPTIONS)
      .json({ message: 'Token refreshed' });
  } catch {
    return res.status(403).json({ message: 'Expired or invalid token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      // Usamos 'verifyRefreshToken' para saber de quién es el token y borrarlo de Redis
      const payload = verifyRefreshToken(token);
      await redis.del(`refresh:${payload.userId}`);
    } catch {
      // Si el token ya era inválido, procedemos con el borrado de cookies igualmente
    }
  }

  return res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
};

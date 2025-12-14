import { Request, Response } from 'express';
import { redis } from '../lib/redis.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  // Usuario mock (portfolio)
  const user = {
    id: '123',
    email,
    passwordHash: await bcrypt.hash('123456', 10),
  };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const payload = { userId: user.id };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await redis.set(`refresh:${user.id}`, refreshToken);

  res
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json({ message: 'Logged in' });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const stored = await redis.get(`refresh:${payload.userId}`);

    if (stored !== token) {
      res.sendStatus(403);
      return;
    }

    const newAccessToken = signAccessToken({ userId: payload.userId });

    res.cookie('accessToken', newAccessToken, COOKIE_OPTIONS).json({ message: 'Token refreshed' });
  } catch {
    res.sendStatus(403);
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    const payload = verifyRefreshToken(token);
    await redis.del(`refresh:${payload.userId}`);
  }

  res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
};

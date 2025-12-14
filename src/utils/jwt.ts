import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JWT_CONFIG } from '../config/jwt.js';

export interface JwtPayload {
  userId: string;
}

const accessOptions: SignOptions = {
  expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN,
};

const refreshOptions: SignOptions = {
  expiresIn: JWT_CONFIG.REFRESH_EXPIRES_IN,
};

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, accessOptions);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { UserRole } from '../types';
import { AppError } from './errors';

export interface JwtTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  tokenType: 'access' | 'refresh';
}

function signToken(payload: JwtTokenPayload, secret: string, expiresIn: string): string {
  return jwt.sign(payload as object, secret, { expiresIn: expiresIn as any });
}

export function signAccessToken(payload: Omit<JwtTokenPayload, 'tokenType'>): string {
  return signToken({ ...payload, tokenType: 'access' }, env.JWT_SECRET, env.JWT_ACCESS_EXPIRY);
}

export function signRefreshToken(payload: Omit<JwtTokenPayload, 'tokenType'>): string {
  return signToken(
    { ...payload, tokenType: 'refresh' },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRY,
  );
}

function verifyToken(token: string, secret: string): JwtTokenPayload {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === 'string') {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid token payload');
    }

    return decoded as JwtTokenPayload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
}

export function verifyAccessToken(token: string): JwtTokenPayload {
  return verifyToken(token, env.JWT_SECRET);
}

export function verifyRefreshToken(token: string): JwtTokenPayload {
  return verifyToken(token, env.JWT_REFRESH_SECRET);
}
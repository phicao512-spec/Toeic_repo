import crypto from 'node:crypto';
import { Role, type User } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { getRedisClient } from '../config/redis';
import { AppError } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';
import { emailService } from './email.service';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RefreshInput {
  refreshToken: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: Role;
    targetScore: number | null;
  };
  accessToken: string;
  refreshToken: string;
}

interface MemoryValue {
  value: string;
  expiresAt: number;
}

const memoryCache = new Map<string, MemoryValue>();

const REFRESH_KEY_PREFIX = 'auth:refresh';
const RESET_KEY_PREFIX = 'auth:reset';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshTokenCacheKey(userId: string, refreshToken: string): string {
  return `${REFRESH_KEY_PREFIX}:${userId}:${hashToken(refreshToken)}`;
}

function resetTokenCacheKey(token: string): string {
  return `${RESET_KEY_PREFIX}:${hashToken(token)}`;
}

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/i);
  if (!match) {
    const asNumber = Number(duration);
    return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : 60;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 60;
  }
}

function getFromMemory(key: string): string | null {
  const found = memoryCache.get(key);
  if (!found) {
    return null;
  }

  if (Date.now() > found.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return found.value;
}

function setInMemory(key: string, value: string, ttlSeconds: number): void {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, value, 'EX', ttlSeconds);
    return;
  }

  setInMemory(key, value, ttlSeconds);
}

async function cacheGet(key: string): Promise<string | null> {
  const redis = await getRedisClient();
  if (redis) {
    return redis.get(key);
  }

  return getFromMemory(key);
}

async function cacheDelete(key: string): Promise<void> {
  const redis = await getRedisClient();
  if (redis) {
    await redis.del(key);
    return;
  }

  memoryCache.delete(key);
}

function toAuthUser(user: User): AuthResult['user'] {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    targetScore: user.targetScore,
  };
}

async function createTokenPair(user: User): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshTtl = parseDurationToSeconds(env.JWT_REFRESH_EXPIRY);
  await cacheSet(refreshTokenCacheKey(user.id, refreshToken), '1', refreshTtl);

  return { accessToken, refreshToken };
}

async function register(input: RegisterInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, 'CONFLICT', 'Email already in use');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email,
      name: input.name.trim(),
      password: passwordHash,
    },
  });

  const { accessToken, refreshToken } = await createTokenPair(user);

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
}

async function login(input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const { accessToken, refreshToken } = await createTokenPair(user);

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
}

async function refreshTokens(input: RefreshInput): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyRefreshToken(input.refreshToken);
  if (payload.tokenType !== 'refresh') {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');
  }

  const oldTokenKey = refreshTokenCacheKey(payload.userId, input.refreshToken);
  const isActive = await cacheGet(oldTokenKey);
  if (!isActive) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or revoked refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'User not found for token');
  }

  await cacheDelete(oldTokenKey);
  return createTokenPair(user);
}

async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const email = normalizeEmail(input.email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTtlSeconds = env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES * 60;

  await cacheSet(resetTokenCacheKey(resetToken), user.id, resetTtlSeconds);
  await emailService.sendPasswordResetEmail(user.email, resetToken);
}

async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenKey = resetTokenCacheKey(input.token);
  const userId = await cacheGet(tokenKey);

  if (!userId) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });

  await cacheDelete(tokenKey);
}

export const authService = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response';

export const AUTH_RATE_LIMIT_MAX = 5;
export const GENERAL_RATE_LIMIT_MAX = 100;

function createRateLimitHandler(message: string): RequestHandler {
  return (req, res) => {
    res.status(429).json(errorResponse('RATE_LIMITED', message));
  };
}

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many authentication requests. Please try again later.'),
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: GENERAL_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many requests. Please try again later.'),
});
import type { RequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { verifyAccessToken } from '../utils/token';

export const auth: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header'));
    return;
  }

  const token = authorization.replace('Bearer ', '').trim();

  try {
    const payload = verifyAccessToken(token);

    if (payload.tokenType !== 'access') {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid access token');
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
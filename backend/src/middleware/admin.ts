import type { RequestHandler } from 'express';
import { AppError } from '../utils/errors';

export const admin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
    return;
  }

  if (req.user.role !== 'ADMIN') {
    next(new AppError(403, 'FORBIDDEN', 'Admin access required'));
    return;
  }

  next();
};
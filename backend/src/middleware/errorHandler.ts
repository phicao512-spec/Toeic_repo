import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(errorResponse('NOT_FOUND', 'Resource not found'));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.code, error.message, error.details));
    return;
  }

  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res
      .status(400)
      .json(errorResponse('VALIDATION_ERROR', 'Request validation failed', details));
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json(errorResponse('CONFLICT', 'Resource already exists'));
    return;
  }

  if (error instanceof Error && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
    res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid or expired token'));
    return;
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('Unhandled error:', message);

  res.status(500).json(errorResponse('INTERNAL_ERROR', 'Internal server error'));
};
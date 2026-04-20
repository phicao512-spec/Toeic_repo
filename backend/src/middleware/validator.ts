import type { RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/errors';

export function validate(schema: AnyZodObject, source: 'body' | 'params' | 'query' = 'body'): RequestHandler {
  return (req, _res, next) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', details));
        return;
      }

      next(error);
    }
  };
}
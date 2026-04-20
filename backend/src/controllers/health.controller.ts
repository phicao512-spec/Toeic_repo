import type { RequestHandler } from 'express';
import { successResponse } from '../utils/response';

export const getHealth: RequestHandler = (_req, res) => {
  res.status(200).json(
    successResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  );
};
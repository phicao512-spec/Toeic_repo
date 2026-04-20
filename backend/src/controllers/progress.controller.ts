import type { RequestHandler } from 'express';
import { progressService } from '../services/progress.service';
import { successResponse } from '../utils/response';

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const stats = await progressService.getDashboardStats(req.user!.userId);
    res.json(successResponse(stats));
  } catch (error) { next(error); }
};

export const getPartAccuracy: RequestHandler = async (req, res, next) => {
  try {
    const data = await progressService.getPartAccuracy(req.user!.userId);
    res.json(successResponse(data));
  } catch (error) { next(error); }
};

export const recordStudy: RequestHandler = async (req, res, next) => {
  try {
    const result = await progressService.recordStudy(req.user!.userId, req.body);
    res.json(successResponse(result));
  } catch (error) { next(error); }
};

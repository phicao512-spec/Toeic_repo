import type { RequestHandler } from 'express';
import { testService } from '../services/test.service';
import { successResponse } from '../utils/response';

export const getAllTests: RequestHandler = async (_req, res, next) => {
  try {
    const tests = await testService.getAllTests();
    res.json(successResponse(tests));
  } catch (error) { next(error); }
};

export const getTest: RequestHandler = async (req, res, next) => {
  try {
    const test = await testService.getTestById(req.params.id);
    res.json(successResponse(test));
  } catch (error) { next(error); }
};

export const startAttempt: RequestHandler = async (req, res, next) => {
  try {
    const result = await testService.startAttempt(req.user!.userId, req.params.id);
    res.status(201).json(successResponse(result));
  } catch (error) { next(error); }
};

export const submitAttempt: RequestHandler = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const result = await testService.submitAttempt(req.user!.userId, req.params.attemptId, answers);
    res.json(successResponse(result));
  } catch (error) { next(error); }
};

export const getMyAttempts: RequestHandler = async (req, res, next) => {
  try {
    const attempts = await testService.getUserAttempts(req.user!.userId);
    res.json(successResponse(attempts));
  } catch (error) { next(error); }
};

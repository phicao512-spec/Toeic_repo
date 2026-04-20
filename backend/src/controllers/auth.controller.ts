import type { RequestHandler } from 'express';
import { successResponse } from '../utils/response';
import { authService } from '../services/auth.service';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.refreshTokens(req.body);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body);

    res.status(200).json(
      successResponse({
        message: 'If the account exists, a password reset link has been sent.',
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);

    res.status(200).json(
      successResponse({
        message: 'Password has been reset successfully.',
      }),
    );
  } catch (error) {
    next(error);
  }
};
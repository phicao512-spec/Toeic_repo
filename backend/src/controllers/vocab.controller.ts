import type { RequestHandler } from 'express';
import { vocabService } from '../services/vocab.service';
import { successResponse } from '../utils/response';

export const getTopics: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const topics = await vocabService.getAllTopics(userId);
    res.json(successResponse(topics));
  } catch (error) { next(error); }
};

export const getWords: RequestHandler = async (req, res, next) => {
  try {
    const data = await vocabService.getWordsByTopic(req.params.topicId);
    res.json(successResponse(data));
  } catch (error) { next(error); }
};

export const getReviewWords: RequestHandler = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const words = await vocabService.getReviewWords(req.user!.userId, limit);
    res.json(successResponse(words));
  } catch (error) { next(error); }
};

export const reviewWord: RequestHandler = async (req, res, next) => {
  try {
    const { wordId, quality } = req.body;
    const result = await vocabService.reviewWord(req.user!.userId, wordId, quality);
    res.json(successResponse(result));
  } catch (error) { next(error); }
};

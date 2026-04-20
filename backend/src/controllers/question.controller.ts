import type { RequestHandler } from 'express';
import { questionService } from '../services/question.service';
import { successResponse } from '../utils/response';

export const getQuestions: RequestHandler = async (req, res, next) => {
  try {
    const { part, difficulty, limit, offset } = req.query;
    const data = await questionService.getQuestions({
      part: part as string,
      difficulty: difficulty as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(successResponse(data));
  } catch (error) { next(error); }
};

export const getQuestion: RequestHandler = async (req, res, next) => {
  try {
    const showAnswer = req.query.showAnswer === 'true';
    const data = await questionService.getQuestionById(req.params.id, showAnswer);
    res.json(successResponse(data));
  } catch (error) { next(error); }
};

export const checkAnswer: RequestHandler = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const result = await questionService.checkAnswer(questionId, answer);
    res.json(successResponse(result));
  } catch (error) { next(error); }
};

export const getPracticeSet: RequestHandler = async (req, res, next) => {
  try {
    const part = req.params.part;
    const count = parseInt(req.query.count as string) || 10;
    const data = await questionService.getPracticeSet(part, count);
    res.json(successResponse(data));
  } catch (error) { next(error); }
};

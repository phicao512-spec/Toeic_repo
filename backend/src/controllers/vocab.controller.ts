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

export const createTopic: RequestHandler = async (req, res, next) => {
  try {
    const topic = await vocabService.createTopic(req.body);
    res.status(201).json(successResponse(topic));
  } catch (error) { next(error); }
};

export const updateTopic: RequestHandler = async (req, res, next) => {
  try {
    const topic = await vocabService.updateTopic(req.params.id, req.body);
    res.json(successResponse(topic));
  } catch (error) { next(error); }
};

export const deleteTopic: RequestHandler = async (req, res, next) => {
  try {
    await vocabService.deleteTopic(req.params.id);
    res.json(successResponse({ message: 'Topic deleted' }));
  } catch (error) { next(error); }
};

export const createWord: RequestHandler = async (req, res, next) => {
  try {
    const word = await vocabService.createWord(req.body);
    res.status(201).json(successResponse(word));
  } catch (error) { next(error); }
};

export const updateWord: RequestHandler = async (req, res, next) => {
  try {
    const word = await vocabService.updateWord(req.params.id, req.body);
    res.json(successResponse(word));
  } catch (error) { next(error); }
};

export const deleteWord: RequestHandler = async (req, res, next) => {
  try {
    await vocabService.deleteWord(req.params.id);
    res.json(successResponse({ message: 'Word deleted' }));
  } catch (error) { next(error); }
};

export const importWords: RequestHandler = async (req, res, next) => {
  try {
    const { topicId, words } = req.body;
    const result = await vocabService.importWords(topicId, words);
    res.json(successResponse(result));
  } catch (error) { next(error); }
};

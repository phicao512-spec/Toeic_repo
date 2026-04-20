import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

async function getQuestions(filters: {
  part?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters.part) where.part = filters.part;
  if (filters.difficulty) where.difficulty = filters.difficulty;

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      take: filters.limit || 20,
      skip: filters.offset || 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, part: true, type: true, content: true, audioUrl: true,
        imageUrl: true, passage: true, options: true, difficulty: true,
        tags: true,
        // Don't expose answer in listing
      },
    }),
    prisma.question.count({ where }),
  ]);

  return {
    items: items.map((q) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      tags: typeof q.tags === 'string' ? JSON.parse(q.tags) : q.tags,
    })),
    total,
    page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
    pageSize: filters.limit || 20,
    totalPages: Math.ceil(total / (filters.limit || 20)),
  };
}

async function getQuestionById(id: string, showAnswer = false) {
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q) throw new AppError(404, 'NOT_FOUND', 'Question not found');

  const result: Record<string, unknown> = {
    id: q.id, part: q.part, type: q.type, content: q.content,
    audioUrl: q.audioUrl, imageUrl: q.imageUrl, passage: q.passage,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    difficulty: q.difficulty,
    tags: typeof q.tags === 'string' ? JSON.parse(q.tags) : q.tags,
  };

  if (showAnswer) {
    result.answer = q.answer;
    result.explanation = q.explanation;
  }

  return result;
}

async function checkAnswer(questionId: string, userAnswer: string) {
  const q = await prisma.question.findUnique({ where: { id: questionId } });
  if (!q) throw new AppError(404, 'NOT_FOUND', 'Question not found');

  const isCorrect = q.answer === userAnswer;
  return {
    isCorrect,
    correctAnswer: q.answer,
    explanation: q.explanation,
  };
}

async function getPracticeSet(part: string, count = 10) {
  const questions = await prisma.question.findMany({
    where: { part },
    orderBy: { createdAt: 'asc' },
    take: count,
  });

  return questions.map((q) => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    tags: typeof q.tags === 'string' ? JSON.parse(q.tags) : q.tags,
    answer: undefined, // hide answer
    explanation: undefined,
  }));
}

export const questionService = { getQuestions, getQuestionById, checkAnswer, getPracticeSet };

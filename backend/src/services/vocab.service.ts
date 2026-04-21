import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

async function getAllTopics(userId?: string) {
  const topics = await prisma.vocabTopic.findMany({
    orderBy: { order: 'asc' },
    include: { words: { select: { id: true } }, _count: { select: { words: true } } },
  });

  if (userId) {
    const progress = await prisma.vocabProgress.groupBy({
      by: ['wordId'],
      where: { userId, level: { gte: 1 } },
    });
    const learnedWordIds = new Set(progress.map((p) => p.wordId));

    const wordsWithTopics = await prisma.word.findMany({
      select: { id: true, topicId: true },
    });

    const learnedByTopic: Record<string, number> = {};
    for (const w of wordsWithTopics) {
      if (learnedWordIds.has(w.id)) {
        learnedByTopic[w.topicId] = (learnedByTopic[w.topicId] || 0) + 1;
      }
    }

    return topics.map((t) => ({
      id: t.id,
      name: t.name,
      nameVi: t.nameVi,
      description: t.description,
      icon: t.icon,
      order: t.order,
      wordCount: t._count.words,
      learnedCount: learnedByTopic[t.id] || 0,
      wordIds: t.words.map(w => w.id),
    }));
  }

  return topics.map((t) => ({
    id: t.id,
    name: t.name,
    nameVi: t.nameVi,
    description: t.description,
    icon: t.icon,
    order: t.order,
    wordCount: t._count.words,
    learnedCount: 0,
    wordIds: t.words.map(w => w.id),
  }));
}

async function getWordsByTopic(topicId: string) {
  const topic = await prisma.vocabTopic.findUnique({ where: { id: topicId } });
  if (!topic) throw new AppError(404, 'NOT_FOUND', 'Topic not found');

  const words = await prisma.word.findMany({
    where: { topicId },
    orderBy: { word: 'asc' },
  });

  return { topic, words };
}

async function getReviewWords(userId: string, limit = 20) {
  const now = new Date();
  const dueWords = await prisma.vocabProgress.findMany({
    where: { userId, nextReview: { lte: now } },
    include: { word: true },
    orderBy: { nextReview: 'asc' },
    take: limit,
  });

  if (dueWords.length < limit) {
    const existingWordIds = await prisma.vocabProgress.findMany({
      where: { userId },
      select: { wordId: true },
    });
    const ids = existingWordIds.map((e) => e.wordId);

    const newWords = await prisma.word.findMany({
      where: { id: { notIn: ids } },
      take: limit - dueWords.length,
    });

    return [
      ...dueWords.map((d) => ({ ...d.word, progress: { level: d.level, nextReview: d.nextReview } })),
      ...newWords.map((w) => ({ ...w, progress: null })),
    ];
  }

  return dueWords.map((d) => ({ ...d.word, progress: { level: d.level, nextReview: d.nextReview } }));
}

async function reviewWord(userId: string, wordId: string, quality: number) {
  // SM-2 algorithm: quality 0-5
  const q = Math.max(0, Math.min(5, quality));

  let progress = await prisma.vocabProgress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });

  if (!progress) {
    progress = await prisma.vocabProgress.create({
      data: { userId, wordId, level: 0, easeFactor: 2.5, nextReview: new Date() },
    });
  }

  let { level, easeFactor } = progress;
  const isCorrect = q >= 3;

  if (isCorrect) {
    level = Math.min(level + 1, 5);
  } else {
    level = 0;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  let interval: number;
  if (level === 0) interval = 0;
  else if (level === 1) interval = 1;
  else if (level === 2) interval = 6;
  else interval = Math.round((level - 1) * easeFactor);

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  const updated = await prisma.vocabProgress.update({
    where: { userId_wordId: { userId, wordId } },
    data: {
      level,
      easeFactor,
      nextReview,
      correctCount: isCorrect ? progress.correctCount + 1 : progress.correctCount,
      wrongCount: isCorrect ? progress.wrongCount : progress.wrongCount + 1,
      lastReviewed: new Date(),
    },
  });

  return updated;
}

async function createTopic(data: { name: string; nameVi: string; description: string; icon: string; order?: number }) {
  const lastTopic = await prisma.vocabTopic.findFirst({ orderBy: { order: 'desc' } });
  const order = data.order ?? (lastTopic ? lastTopic.order + 1 : 1);
  return prisma.vocabTopic.create({ data: { ...data, order } });
}

async function updateTopic(id: string, data: Partial<{ name: string; nameVi: string; description: string; icon: string; order: number }>) {
  return prisma.vocabTopic.update({ where: { id }, data });
}

async function deleteTopic(id: string) {
  return prisma.vocabTopic.delete({ where: { id } });
}

async function createWord(data: { word: string; pronunciation: string; partOfSpeech: string; meaningVi: string; meaningEn: string; example: string; exampleVi: string; topicId: string }) {
  return prisma.word.create({ data });
}

async function updateWord(id: string, data: Partial<{ word: string; pronunciation: string; partOfSpeech: string; meaningVi: string; meaningEn: string; example: string; exampleVi: string }>) {
  return prisma.word.update({ where: { id }, data });
}

async function deleteWord(id: string) {
  return prisma.word.delete({ where: { id } });
}

async function importWords(topicId: string, words: { word: string; pronunciation: string; meaningVi: string }[]) {
  const data = words.map(w => ({
    ...w,
    topicId,
    partOfSpeech: 'n', // Default to noun
    meaningEn: '',
    example: '',
    exampleVi: ''
  }));

  // Using createMany for performance
  return prisma.word.createMany({
    data,
    skipDuplicates: true
  });
}

export const vocabService = { 
  getAllTopics, 
  getWordsByTopic, 
  getReviewWords, 
  reviewWord,
  createTopic,
  updateTopic,
  deleteTopic,
  createWord,
  updateWord,
  deleteWord,
  importWords
};


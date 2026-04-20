import { prisma } from '../config/database';
import { AppError } from '../utils/errors';

// TOEIC Score conversion table (approximate)
const LISTENING_TABLE = [5,5,5,10,15,20,25,35,45,55,65,80,95,110,125,140,155,170,180,195,
  210,220,230,240,250,260,270,280,290,300,305,315,320,325,330,335,345,350,355,360,365,
  370,375,380,385,390,395,400,405,410,415,420,425,430,435,440,445,450,455,460,465,
  470,475,480,485,490,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,
  495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495];

const READING_TABLE  = [5,5,5,5,5,10,15,20,25,30,35,40,50,60,70,80,90,100,110,120,
  130,140,150,155,160,170,175,180,185,190,195,200,210,215,220,230,235,240,245,250,
  255,260,270,275,280,285,290,295,300,310,315,320,325,330,335,340,345,350,355,360,
  365,370,375,380,390,395,400,405,410,420,425,430,435,440,445,450,455,460,465,470,
  475,480,485,490,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495,495];

function convertScore(correct: number, table: number[]): number {
  const idx = Math.min(correct, table.length - 1);
  return table[idx];
}

async function getAllTests() {
  return prisma.test.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, description: true, duration: true,
      isFullTest: true, totalQuestions: true,
      _count: { select: { attempts: true } },
    },
  });
}

async function getTestById(testId: string) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { question: true },
      },
    },
  });
  if (!test) throw new AppError(404, 'NOT_FOUND', 'Test not found');

  return {
    ...test,
    questions: test.questions.map((tq) => ({
      id: tq.question.id,
      order: tq.order,
      part: tq.question.part,
      type: tq.question.type,
      content: tq.question.content,
      audioUrl: tq.question.audioUrl,
      imageUrl: tq.question.imageUrl,
      passage: tq.question.passage,
      options: typeof tq.question.options === 'string' ? JSON.parse(tq.question.options) : tq.question.options,
      difficulty: tq.question.difficulty,
      // Don't expose answer
    })),
  };
}

async function startAttempt(userId: string, testId: string) {
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) throw new AppError(404, 'NOT_FOUND', 'Test not found');

  const attempt = await prisma.testAttempt.create({
    data: {
      userId,
      testId,
      status: 'IN_PROGRESS',
      answers: '{}',
    },
  });

  return { attemptId: attempt.id, duration: test.duration };
}

async function submitAttempt(
  userId: string, attemptId: string, answers: Record<string, string>
) {
  const attempt = await prisma.testAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt || attempt.userId !== userId) {
    throw new AppError(404, 'NOT_FOUND', 'Attempt not found');
  }

  // Get all questions for this test
  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: attempt.testId },
    include: { question: true },
    orderBy: { order: 'asc' },
  });

  let correctListening = 0;
  let correctReading = 0;
  const listeningParts = ['PART1', 'PART2', 'PART3', 'PART4'];

  for (const tq of testQuestions) {
    const userAnswer = answers[tq.question.id];
    if (userAnswer === tq.question.answer) {
      if (listeningParts.includes(tq.question.part)) {
        correctListening++;
      } else {
        correctReading++;
      }
    }
  }

  const listeningScore = convertScore(correctListening, LISTENING_TABLE);
  const readingScore = convertScore(correctReading, READING_TABLE);
  const totalScore = listeningScore + readingScore;

  const timeSpent = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);

  const updated = await prisma.testAttempt.update({
    where: { id: attemptId },
    data: {
      answers: JSON.stringify(answers),
      listeningScore,
      readingScore,
      totalScore,
      correctListening,
      correctReading,
      timeSpent,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  // Build detailed results
  const detailedResults = testQuestions.map((tq) => ({
    questionId: tq.question.id,
    order: tq.order,
    part: tq.question.part,
    userAnswer: answers[tq.question.id] || '',
    correctAnswer: tq.question.answer,
    isCorrect: answers[tq.question.id] === tq.question.answer,
    explanation: tq.question.explanation,
  }));

  return {
    id: updated.id,
    testId: updated.testId,
    listeningScore,
    readingScore,
    totalScore,
    correctListening,
    correctReading,
    timeSpent,
    detailedResults,
  };
}

async function getUserAttempts(userId: string) {
  return prisma.testAttempt.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    include: { test: { select: { title: true } } },
  });
}

export const testService = { getAllTests, getTestById, startAttempt, submitAttempt, getUserAttempts };

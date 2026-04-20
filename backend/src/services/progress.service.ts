import { prisma } from '../config/database';

async function getDashboardStats(userId: string) {
  const [vocabProgress, testAttempts, streaks, totalWords] = await Promise.all([
    prisma.vocabProgress.count({ where: { userId, level: { gte: 1 } } }),
    prisma.testAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 10,
    }),
    prisma.studyStreak.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.word.count(),
  ]);

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateSet = new Set(streaks.map((s) => s.date.toISOString().slice(0, 10)));

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dateSet.has(d.toISOString().slice(0, 10))) {
      currentStreak++;
    } else break;
  }

  const bestScore = testAttempts.reduce((max, a) => Math.max(max, a.totalScore), 0);
  const latestScore = testAttempts[0]?.totalScore || 0;
  const totalStudyMinutes = streaks.reduce((sum, s) => sum + s.minutesStudied, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, targetScore: true },
  });

  return {
    user: { name: user?.name || '', targetScore: user?.targetScore || 600 },
    wordsLearned: vocabProgress,
    wordsTotal: totalWords,
    currentStreak,
    bestScore,
    latestScore,
    totalStudyMinutes,
    recentTests: testAttempts.slice(0, 5).map((a) => ({
      id: a.id,
      totalScore: a.totalScore,
      listeningScore: a.listeningScore,
      readingScore: a.readingScore,
      completedAt: a.completedAt,
    })),
    streakCalendar: streaks.map((s) => ({
      date: s.date.toISOString().slice(0, 10),
      minutesStudied: s.minutesStudied,
      wordsLearned: s.wordsLearned,
      questionsAnswered: s.questionsAnswered,
    })),
  };
}

async function getPartAccuracy(userId: string) {
  const progress = await prisma.progress.findMany({
    where: { userId },
  });

  const partMap: Record<string, { correct: number; total: number }> = {};
  for (const p of progress) {
    if (!partMap[p.part]) partMap[p.part] = { correct: 0, total: 0 };
    partMap[p.part].correct += p.correct;
    partMap[p.part].total += p.total;
  }

  return Object.entries(partMap).map(([part, data]) => ({
    part,
    correct: data.correct,
    total: data.total,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));
}

async function recordStudy(userId: string, data: {
  minutesStudied: number;
  wordsLearned?: number;
  questionsAnswered?: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.studyStreak.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      minutesStudied: { increment: data.minutesStudied },
      wordsLearned: { increment: data.wordsLearned || 0 },
      questionsAnswered: { increment: data.questionsAnswered || 0 },
    },
    create: {
      userId,
      date: today,
      minutesStudied: data.minutesStudied,
      wordsLearned: data.wordsLearned || 0,
      questionsAnswered: data.questionsAnswered || 0,
    },
  });
}

export const progressService = { getDashboardStats, getPartAccuracy, recordStudy };

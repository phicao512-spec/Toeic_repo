export type ToeicPart = "PART1" | "PART2" | "PART3" | "PART4" | "PART5" | "PART6" | "PART7";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "SINGLE_CHOICE" | "MULTI_PASSAGE" | "FILL_IN_BLANK";

export interface Question {
  id: string;
  part: ToeicPart;
  type: QuestionType;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  passage?: string;
  passageGroup?: string;
  options: string[];
  answer?: string; // only in review mode
  explanation?: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  isFullTest: boolean;
  totalQuestions: number;
  attemptCount?: number;
  bestScore?: number;
}

export interface TestQuestion extends Question {
  order: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  answers: Record<string, string>;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  correctListening: number;
  correctReading: number;
  timeSpent: number;
  completedAt: string;
}

export interface TestResult extends TestAttempt {
  partBreakdown: Record<ToeicPart, { correct: number; total: number }>;
  detailedResults: Array<{
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

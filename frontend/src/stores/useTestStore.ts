"use client";
import { create } from "zustand";
import type { TestQuestion, TestResult } from "@/types/test";

interface TestStore {
  // Current test session
  testId: string | null;
  attemptId: string | null;
  questions: TestQuestion[];
  answers: Record<string, string>; // questionId → selected answer
  markedForReview: Set<string>;
  currentQuestionIndex: number;
  timeRemaining: number; // seconds
  isSubmitted: boolean;
  result: TestResult | null;

  // Actions
  startTest: (testId: string, attemptId: string, questions: TestQuestion[], duration: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tickTimer: () => void;
  submitTest: (result: TestResult) => void;
  resetTest: () => void;
}

const initialState = {
  testId: null,
  attemptId: null,
  questions: [],
  answers: {},
  markedForReview: new Set<string>(),
  currentQuestionIndex: 0,
  timeRemaining: 7200,
  isSubmitted: false,
  result: null,
};

export const useTestStore = create<TestStore>((set, get) => ({
  ...initialState,

  startTest: (testId, attemptId, questions, duration) =>
    set({ testId, attemptId, questions, timeRemaining: duration, isSubmitted: false, answers: {}, markedForReview: new Set(), currentQuestionIndex: 0 }),

  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),

  toggleMarkForReview: (questionId) =>
    set((state) => {
      const next = new Set(state.markedForReview);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return { markedForReview: next };
    }),

  goToQuestion: (index) => set({ currentQuestionIndex: index }),
  nextQuestion: () => set((s) => ({ currentQuestionIndex: Math.min(s.currentQuestionIndex + 1, s.questions.length - 1) })),
  prevQuestion: () => set((s) => ({ currentQuestionIndex: Math.max(s.currentQuestionIndex - 1, 0) })),
  tickTimer: () => set((s) => ({ timeRemaining: Math.max(0, s.timeRemaining - 1) })),
  submitTest: (result) => set({ isSubmitted: true, result }),
  resetTest: () => set(initialState),
}));

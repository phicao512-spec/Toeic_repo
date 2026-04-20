"use client";
import { create } from "zustand";
import type { VocabTopic, Word } from "@/types/vocabulary";

interface VocabStore {
  currentTopic: VocabTopic | null;
  reviewQueue: Word[];
  currentWordIndex: number;

  setCurrentTopic: (topic: VocabTopic) => void;
  setReviewQueue: (words: Word[]) => void;
  nextWord: () => void;
  prevWord: () => void;
  resetVocab: () => void;
}

export const useVocabStore = create<VocabStore>((set) => ({
  currentTopic: null,
  reviewQueue: [],
  currentWordIndex: 0,

  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setReviewQueue: (words) => set({ reviewQueue: words, currentWordIndex: 0 }),
  nextWord: () => set((s) => ({ currentWordIndex: Math.min(s.currentWordIndex + 1, s.reviewQueue.length - 1) })),
  prevWord: () => set((s) => ({ currentWordIndex: Math.max(s.currentWordIndex - 1, 0) })),
  resetVocab: () => set({ reviewQueue: [], currentWordIndex: 0 }),
}));

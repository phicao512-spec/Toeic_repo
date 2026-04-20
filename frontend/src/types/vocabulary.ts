export interface VocabTopic {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  order: number;
  wordCount: number;
  learnedCount?: number;
}

export interface Word {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaningVi: string;
  meaningEn: string;
  example: string;
  exampleVi: string;
  audioUrl?: string;
  imageUrl?: string;
  topicId: string;
}

export interface VocabProgress {
  wordId: string;
  level: number; // 0-5
  nextReview: string;
  correctCount: number;
  wrongCount: number;
}

import { create } from 'zustand';
import { NATO_MAP, isCorrectAnswer } from '../constants/nato';
import { shuffleArray } from '../utils/helpers';
import type { QuizQuestion, QuizSession } from '../types';

interface QuizStore {
  session: QuizSession | null;
  startQuiz: (mode: 'random' | 'weak', letters: string[], length: number) => void;
  submitAnswer: (answer: string) => { isCorrect: boolean; correctAnswer: string };
  nextQuestion: () => boolean;
  endQuiz: () => QuizSession | null;
  currentQuestion: () => QuizQuestion | null;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  session: null,

  startQuiz: (mode, letters, length) => {
    const picked = shuffleArray(letters).slice(0, length);
    const questions: QuizQuestion[] = picked.map((letter) => ({
      letter,
      correctAnswer: NATO_MAP[letter],
      userAnswer: null,
      isCorrect: null,
      answeredAt: null,
    }));

    set({
      session: {
        mode,
        questions,
        currentIndex: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
      },
    });
  },

  submitAnswer: (answer: string) => {
    const { session } = get();
    if (!session) return { isCorrect: false, correctAnswer: '' };

    const q = session.questions[session.currentIndex];
    const correct = isCorrectAnswer(q.letter, answer);

    const updatedQuestions = [...session.questions];
    updatedQuestions[session.currentIndex] = {
      ...q,
      userAnswer: answer.trim(),
      isCorrect: correct,
      answeredAt: new Date().toISOString(),
    };

    set({
      session: { ...session, questions: updatedQuestions },
    });

    return { isCorrect: correct, correctAnswer: q.correctAnswer };
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return false;
    const nextIdx = session.currentIndex + 1;
    if (nextIdx >= session.questions.length) return false;
    set({ session: { ...session, currentIndex: nextIdx } });
    return true;
  },

  endQuiz: () => {
    const { session } = get();
    if (!session) return null;
    const completed = {
      ...session,
      completedAt: new Date().toISOString(),
    };
    set({ session: null });
    return completed;
  },

  currentQuestion: () => {
    const { session } = get();
    if (!session) return null;
    return session.questions[session.currentIndex];
  },
}));

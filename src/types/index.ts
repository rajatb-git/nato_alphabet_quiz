export interface LetterStat {
  letter: string;
  attempts: number;
  correct: number;
  lastAttempted: string | null;
}

export interface DailyRecord {
  date: string;
  totalAttempts: number;
  totalCorrect: number;
  quizSessions: number;
}

export interface UserStats {
  letterStats: Record<string, LetterStat>;
  dailyRecords: Record<string, DailyRecord>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface QuizQuestion {
  letter: string;
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean | null;
  answeredAt: string | null;
}

export interface QuizSession {
  mode: 'random' | 'weak';
  questions: QuizQuestion[];
  currentIndex: number;
  startedAt: string;
  completedAt: string | null;
}

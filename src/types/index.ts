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
  totalSessions: number;
  spellingCompleted: number;
  morseCompleted: number;
  dailyChallengesCompleted: number;
}

export interface QuizQuestion {
  letter: string;
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean | null;
  answeredAt: string | null;
}

export interface Settings {
  hapticEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface QuizSession {
  mode: 'random' | 'weak';
  questions: QuizQuestion[];
  currentIndex: number;
  startedAt: string;
  completedAt: string | null;
}

export interface Achievement {
  id: string;
  unlockedAt: string;
}

export interface DailyChallenge {
  date: string;
  seed: number;
  letters: string[];
  completed: boolean;
  score: number | null;
  total: number;
}

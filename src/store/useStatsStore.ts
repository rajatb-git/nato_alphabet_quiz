import { create } from 'zustand';
import type { DailyRecord, LetterStat, UserStats } from '../types';
import { loadStats, saveStats, getDefaultStats } from '../utils/storage';
import { getTodayDate, getYesterdayDate } from '../utils/helpers';

interface StatsStore {
  stats: UserStats;
  isLoaded: boolean;
  load: () => Promise<void>;
  recordAnswer: (letter: string, correct: boolean) => void;
  recordSessionComplete: () => void;
  getWeakLetters: () => string[];
  getTodayRecord: () => DailyRecord;
}

const emptyDay = (date: string): DailyRecord => ({
  date,
  totalAttempts: 0,
  totalCorrect: 0,
  quizSessions: 0,
});

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: getDefaultStats(),
  isLoaded: false,

  load: async () => {
    const stats = await loadStats();
    // Update streak on load
    const today = getTodayDate();
    const yesterday = getYesterdayDate();
    if (stats.lastActiveDate && stats.lastActiveDate !== today && stats.lastActiveDate !== yesterday) {
      stats.currentStreak = 0;
    }
    set({ stats, isLoaded: true });
  },

  recordAnswer: (letter: string, correct: boolean) => {
    const { stats } = get();
    const today = getTodayDate();

    // Update letter stat
    const letterStat: LetterStat = stats.letterStats[letter] ?? {
      letter,
      attempts: 0,
      correct: 0,
      lastAttempted: null,
    };
    letterStat.attempts += 1;
    if (correct) letterStat.correct += 1;
    letterStat.lastAttempted = today;

    // Update daily record
    const dayRecord = stats.dailyRecords[today] ?? emptyDay(today);
    dayRecord.totalAttempts += 1;
    if (correct) dayRecord.totalCorrect += 1;

    // Update streak
    let { currentStreak, longestStreak } = stats;
    if (stats.lastActiveDate !== today) {
      const yesterday = getYesterdayDate();
      if (stats.lastActiveDate === yesterday || stats.lastActiveDate === null) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    }

    const newStats: UserStats = {
      ...stats,
      letterStats: { ...stats.letterStats, [letter]: letterStat },
      dailyRecords: { ...stats.dailyRecords, [today]: dayRecord },
      currentStreak,
      longestStreak,
      lastActiveDate: today,
    };

    set({ stats: newStats });
    saveStats(newStats);
  },

  recordSessionComplete: () => {
    const { stats } = get();
    const today = getTodayDate();
    const dayRecord = stats.dailyRecords[today] ?? emptyDay(today);
    dayRecord.quizSessions += 1;

    const newStats: UserStats = {
      ...stats,
      dailyRecords: { ...stats.dailyRecords, [today]: dayRecord },
    };
    set({ stats: newStats });
    saveStats(newStats);
  },

  getWeakLetters: () => {
    const { stats } = get();
    const letters = Object.values(stats.letterStats);

    // Letters with <70% accuracy and at least 2 attempts
    const weak = letters
      .filter((l) => l.attempts >= 2 && l.correct / l.attempts < 0.7)
      .map((l) => l.letter);

    if (weak.length >= 5) return weak;

    // Pad with lowest accuracy letters that have been attempted
    const attempted = letters
      .filter((l) => l.attempts > 0)
      .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)
      .map((l) => l.letter);

    const result = [...new Set([...weak, ...attempted])];
    return result.slice(0, Math.max(5, weak.length));
  },

  getTodayRecord: () => {
    const { stats } = get();
    const today = getTodayDate();
    return stats.dailyRecords[today] ?? emptyDay(today);
  },
}));

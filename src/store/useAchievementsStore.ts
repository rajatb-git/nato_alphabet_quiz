import { create } from 'zustand';
import type { Achievement } from '../types';
import { loadAchievements, saveAchievements } from '../utils/storage';
import { useStatsStore } from './useStatsStore';

interface AchievementsStore {
  achievements: Achievement[];
  isLoaded: boolean;
  newlyUnlocked: string[];
  load: () => Promise<void>;
  checkAndUnlock: (extraContext?: { quizTime?: number; mode?: string; score?: number; total?: number }) => void;
  clearNewlyUnlocked: () => void;
}

export const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  achievements: [],
  isLoaded: false,
  newlyUnlocked: [],

  load: async () => {
    const achievements = await loadAchievements();
    set({ achievements, isLoaded: true });
  },

  checkAndUnlock: (extraContext) => {
    const { achievements } = get();
    const unlocked = new Set(achievements.map((a) => a.id));
    const stats = useStatsStore.getState().stats;
    const newIds: string[] = [];

    const tryUnlock = (id: string) => {
      if (!unlocked.has(id)) {
        newIds.push(id);
        unlocked.add(id);
      }
    };

    // First quiz
    if ((stats.totalSessions ?? 0) >= 1) tryUnlock('first_quiz');

    // Perfect scores
    if (extraContext?.score !== undefined && extraContext?.total !== undefined) {
      if (extraContext.score === extraContext.total && extraContext.total === 10) tryUnlock('perfect_10');
      if (extraContext.score === extraContext.total && extraContext.total === 26) tryUnlock('perfect_26');
    }

    // Streaks
    if (stats.currentStreak >= 3) tryUnlock('streak_3');
    if (stats.currentStreak >= 7) tryUnlock('streak_7');
    if (stats.currentStreak >= 30) tryUnlock('streak_30');

    // All letters learned
    const allLetters = Object.values(stats.letterStats);
    const learned = allLetters.filter((l) => l.attempts >= 2 && l.correct / l.attempts >= 0.7);
    if (learned.length === 26) tryUnlock('all_learned');

    // Session counts
    const total = stats.totalSessions ?? 0;
    if (total >= 10) tryUnlock('sessions_10');
    if (total >= 50) tryUnlock('sessions_50');
    if (total >= 100) tryUnlock('sessions_100');

    // Mode-specific
    if ((stats.spellingCompleted ?? 0) >= 1) tryUnlock('spelling_first');
    if ((stats.morseCompleted ?? 0) >= 1) tryUnlock('morse_first');
    if ((stats.dailyChallengesCompleted ?? 0) >= 1) tryUnlock('daily_first');
    if ((stats.dailyChallengesCompleted ?? 0) >= 7) tryUnlock('daily_7');

    // Speed demon
    if (extraContext?.quizTime !== undefined && extraContext.quizTime < 30) {
      tryUnlock('speed_demon');
    }

    if (newIds.length > 0) {
      const now = new Date().toISOString();
      const newAchievements = [
        ...achievements,
        ...newIds.map((id) => ({ id, unlockedAt: now })),
      ];
      set({ achievements: newAchievements, newlyUnlocked: newIds });
      saveAchievements(newAchievements);
    }
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
}));

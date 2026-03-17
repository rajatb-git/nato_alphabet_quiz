import AsyncStorage from '@react-native-async-storage/async-storage';
import { NATO_ALPHABET } from '../constants/nato';
import type { UserStats } from '../types';

const STATS_KEY = '@nato_quiz/user_stats';

export function getDefaultStats(): UserStats {
  const letterStats: UserStats['letterStats'] = {};
  for (const entry of NATO_ALPHABET) {
    letterStats[entry.letter] = {
      letter: entry.letter,
      attempts: 0,
      correct: 0,
      lastAttempted: null,
    };
  }
  return {
    letterStats,
    dailyRecords: {},
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  };
}

export async function loadStats(): Promise<UserStats> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (raw) {
      return JSON.parse(raw) as UserStats;
    }
  } catch {
    // ignore parse errors, return default
  }
  return getDefaultStats();
}

export async function saveStats(stats: UserStats): Promise<void> {
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

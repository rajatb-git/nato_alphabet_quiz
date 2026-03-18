import AsyncStorage from '@react-native-async-storage/async-storage';
import { NATO_ALPHABET } from '../constants/nato';
import type { Achievement, DailyChallenge, Settings, UserStats } from '../types';

const STATS_KEY = '@nato_quiz/user_stats';
const SETTINGS_KEY = '@nato_quiz/settings';
const ACHIEVEMENTS_KEY = '@nato_quiz/achievements';
const DAILY_KEY = '@nato_quiz/daily_challenge';

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
    totalSessions: 0,
    spellingCompleted: 0,
    morseCompleted: 0,
    dailyChallengesCompleted: 0,
  };
}

export async function loadStats(): Promise<UserStats> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserStats;
      // Migrate: add new fields if missing
      if (parsed.totalSessions === undefined) parsed.totalSessions = 0;
      if (parsed.spellingCompleted === undefined) parsed.spellingCompleted = 0;
      if (parsed.morseCompleted === undefined) parsed.morseCompleted = 0;
      if (parsed.dailyChallengesCompleted === undefined) parsed.dailyChallengesCompleted = 0;
      return parsed;
    }
  } catch {
    // ignore parse errors, return default
  }
  return getDefaultStats();
}

export async function saveStats(stats: UserStats): Promise<void> {
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getDefaultSettings(): Settings {
  return { hapticEnabled: true, soundEnabled: true, notificationsEnabled: false };
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Settings;
      if (parsed.notificationsEnabled === undefined) parsed.notificationsEnabled = false;
      return parsed;
    }
  } catch {
    // ignore parse errors, return default
  }
  return getDefaultSettings();
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadAchievements(): Promise<Achievement[]> {
  try {
    const raw = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) return JSON.parse(raw) as Achievement[];
  } catch {
    // ignore
  }
  return [];
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export async function loadDailyChallenge(): Promise<DailyChallenge | null> {
  try {
    const raw = await AsyncStorage.getItem(DAILY_KEY);
    if (raw) return JSON.parse(raw) as DailyChallenge;
  } catch {
    // ignore
  }
  return null;
}

export async function saveDailyChallenge(challenge: DailyChallenge): Promise<void> {
  await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(challenge));
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([STATS_KEY, SETTINGS_KEY, ACHIEVEMENTS_KEY, DAILY_KEY]);
}

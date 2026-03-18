import { create } from 'zustand';
import type { Settings } from '../types';
import {
  loadSettings,
  saveSettings,
  getDefaultSettings,
  getDefaultStats,
  clearAllData,
} from '../utils/storage';
import { useStatsStore } from './useStatsStore';
import { requestNotificationPermission, scheduleDailyReminder, cancelReminders } from '../utils/notifications';

interface SettingsStore {
  settings: Settings;
  isLoaded: boolean;
  load: () => Promise<void>;
  setHaptic: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: getDefaultSettings(),
  isLoaded: false,

  load: async () => {
    const settings = await loadSettings();
    set({ settings, isLoaded: true });
  },

  setHaptic: (enabled: boolean) => {
    const settings = { ...get().settings, hapticEnabled: enabled };
    set({ settings });
    saveSettings(settings);
  },

  setSound: (enabled: boolean) => {
    const settings = { ...get().settings, soundEnabled: enabled };
    set({ settings });
    saveSettings(settings);
  },

  setNotifications: async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      await scheduleDailyReminder();
    } else {
      await cancelReminders();
    }
    const settings = { ...get().settings, notificationsEnabled: enabled };
    set({ settings });
    saveSettings(settings);
  },

  clearHistory: async () => {
    await clearAllData();
    // Reset stats store
    useStatsStore.setState({ stats: getDefaultStats(), isLoaded: true });
    // Reset own settings
    const defaults = getDefaultSettings();
    set({ settings: defaults });
  },
}));

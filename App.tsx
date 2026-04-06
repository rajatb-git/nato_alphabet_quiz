import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useStatsStore } from './src/store/useStatsStore';
import { useSettingsStore } from './src/store/useSettingsStore';
import { useAchievementsStore } from './src/store/useAchievementsStore';
import { loadOnboardingDone, saveOnboardingDone } from './src/utils/storage';
import { COLORS } from './src/constants/theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.tabBar,
    border: COLORS.cardBorder,
    primary: COLORS.primary,
  },
};

export default function App() {
  const loadStats = useStatsStore((s) => s.load);
  const statsLoaded = useStatsStore((s) => s.isLoaded);
  const loadSettingsFn = useSettingsStore((s) => s.load);
  const settingsLoaded = useSettingsStore((s) => s.isLoaded);
  const loadAchievementsFn = useAchievementsStore((s) => s.load);
  const achievementsLoaded = useAchievementsStore((s) => s.isLoaded);

  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadStats();
    loadSettingsFn();
    loadAchievementsFn();

    loadOnboardingDone().then((done) => {
      setShowOnboarding(!done);
      setOnboardingChecked(true);
    });
  }, [loadStats, loadSettingsFn, loadAchievementsFn]);

  const allLoaded = statsLoaded && settingsLoaded && achievementsLoaded && onboardingChecked;

  if (!allLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingScreen
          onDone={() => {
            saveOnboardingDone();
            setShowOnboarding(false);
          }}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

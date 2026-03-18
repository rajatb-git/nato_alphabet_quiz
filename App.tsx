import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useStatsStore } from './src/store/useStatsStore';
import { useSettingsStore } from './src/store/useSettingsStore';
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

  useEffect(() => {
    loadStats();
    loadSettingsFn();
  }, [loadStats, loadSettingsFn]);

  if (!statsLoaded || !settingsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <StatusBar style="light" />
      </View>
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

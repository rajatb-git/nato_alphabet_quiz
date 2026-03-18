import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
}

export default function GradientBackground({ children, colors }: Props) {
  const gradientColors = colors ?? (GRADIENTS.background as unknown as [string, string, ...string[]]);
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

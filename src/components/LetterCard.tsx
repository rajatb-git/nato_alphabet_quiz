import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface Props {
  letter: string;
  flashColor?: 'success' | 'error' | null;
}

export default function LetterCard({ letter, flashColor }: Props) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    scale.value = 0.5;
    opacity.value = 0;
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    opacity.value = withSpring(1);
  }, [letter, scale, opacity]);

  useEffect(() => {
    if (flashColor) {
      flash.value = 1;
      flash.value = withTiming(0, { duration: 400 });
    }
  }, [flashColor, flash]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const borderStyle = useAnimatedStyle(() => {
    const color = flashColor === 'success'
      ? interpolateColor(flash.value, [0, 1], [COLORS.cardBorder, COLORS.success])
      : flashColor === 'error'
        ? interpolateColor(flash.value, [0, 1], [COLORS.cardBorder, COLORS.error])
        : COLORS.cardBorder;
    return { borderColor: color };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle, borderStyle]}>
        <Animated.Text style={styles.letter}>{letter}</Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  card: {
    width: 180,
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  letter: {
    fontSize: 120,
    fontWeight: '800',
    color: COLORS.text,
  },
});

import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  correctAnswer: string;
  onDismiss: () => void;
}

export default function CorrectionBanner({ correctAnswer, onDismiss }: Props) {
  const translateY = useSharedValue(-44);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-44, { duration: 200 });
      setTimeout(() => runOnJS(onDismiss)(), 250);
    }, 2000);

    return () => clearTimeout(timer);
  }, [correctAnswer, translateY, opacity, onDismiss]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.banner, animStyle]} pointerEvents="none">
      <Text style={styles.text}>
        Answer: <Text style={styles.answer}>{correctAnswer}</Text>
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    zIndex: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  answer: {
    fontWeight: '700',
    color: COLORS.text,
  },
});

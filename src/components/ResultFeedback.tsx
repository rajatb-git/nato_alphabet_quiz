import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  isCorrect: boolean;
  correctAnswer: string;
  onDismiss: () => void;
}

export default function ResultFeedback({
  isCorrect,
  correctAnswer,
  onDismiss,
}: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      setTimeout(onDismiss, 250);
    }, 1500);

    return () => clearTimeout(timer);
  }, [scale, opacity, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.overlay,
        animatedStyle,
        { backgroundColor: isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isCorrect ? COLORS.success : COLORS.error },
        ]}
      >
        <MaterialCommunityIcons
          name={isCorrect ? 'check' : 'close'}
          size={48}
          color={COLORS.text}
        />
      </View>
      <Text style={[styles.label, { color: isCorrect ? COLORS.success : COLORS.error }]}>
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </Text>
      {!isCorrect && (
        <Text style={styles.correctAnswer}>
          The answer is{' '}
          <Text style={styles.correctWord}>{correctAnswer}</Text>
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
  },
  correctAnswer: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  correctWord: {
    color: COLORS.text,
    fontWeight: '700',
  },
});

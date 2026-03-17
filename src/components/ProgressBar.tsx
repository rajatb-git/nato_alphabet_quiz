import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  current: number;
  total: number;
  correct: number;
}

export default function ProgressBar({ current, total, correct }: Props) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.questionNum}>
          {current} / {total}
        </Text>
        <Text style={styles.score}>
          Score: <Text style={styles.scoreValue}>{correct}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  questionNum: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  score: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scoreValue: {
    color: COLORS.success,
    fontWeight: '700',
  },
  track: {
    height: 4,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
});

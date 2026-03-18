import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import type { QuizSession } from '../types';
import { formatPercent } from '../utils/helpers';

interface Props {
  session: QuizSession;
  onDone: () => void;
}

export default function QuizSummary({ session, onDone }: Props) {
  const correct = session.questions.filter((q) => q.isCorrect).length;
  const total = session.questions.length;
  const percent = formatPercent(correct, total);
  const isGreat = percent >= 80;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isGreat ? COLORS.success : COLORS.warning },
          ]}
        >
          <MaterialCommunityIcons
            name={isGreat ? 'trophy' : 'target'}
            size={48}
            color={COLORS.text}
          />
        </View>

        <Text style={styles.title}>
          {isGreat ? 'Excellent!' : 'Keep Practicing!'}
        </Text>

        <Text style={styles.scoreText}>
          {correct} / {total}
        </Text>
        <Text style={styles.percentText}>{percent}% Accuracy</Text>

        {/* Missed letters */}
        {correct < total && (
          <View style={styles.missedSection}>
            <Text style={styles.missedLabel}>Letters to review:</Text>
            <View style={styles.missedLetters}>
              {session.questions
                .filter((q) => !q.isCorrect)
                .map((q) => (
                  <View key={q.letter} style={styles.missedBadge}>
                    <Text style={styles.missedLetter}>{q.letter}</Text>
                    <Text style={styles.missedWord}>{q.correctAnswer}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={onDone} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  scoreText: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.text,
  },
  percentText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  missedSection: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  missedLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  missedLetters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  missedBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  missedLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.error,
  },
  missedWord: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import StatCard from '../components/StatCard';
import { useStatsStore } from '../store/useStatsStore';
import { NATO_ALPHABET } from '../constants/nato';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatPercent, getLast7Days, getDayLabel } from '../utils/helpers';

function getAccuracyColor(correct: number, attempts: number): string {
  if (attempts === 0) return COLORS.inputBackground;
  const pct = correct / attempts;
  if (pct >= 0.8) return COLORS.success;
  if (pct >= 0.5) return COLORS.warning;
  return COLORS.error;
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const stats = useStatsStore((s) => s.stats);

  // Overall stats
  const allLetters = Object.values(stats.letterStats);
  const totalAttempts = allLetters.reduce((s, l) => s + l.attempts, 0);
  const totalCorrect = allLetters.reduce((s, l) => s + l.correct, 0);
  const overallAccuracy = formatPercent(totalCorrect, totalAttempts);
  const lettersLearned = allLetters.filter(
    (l) => l.attempts >= 2 && l.correct / l.attempts >= 0.7,
  ).length;

  // 7-day data
  const last7 = getLast7Days();
  const maxAttempts = Math.max(
    1,
    ...last7.map((d) => stats.dailyRecords[d]?.totalAttempts ?? 0),
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Statistics</Text>

        {/* Overview cards */}
        <View style={styles.statsRow}>
          <StatCard label="Total" value={totalAttempts} icon="pencil-box-outline" />
          <StatCard
            label="Accuracy"
            value={totalAttempts > 0 ? `${overallAccuracy}%` : '—'}
            icon="target"
            color={overallAccuracy >= 80 ? COLORS.success : COLORS.warning}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Streak" value={stats.currentStreak} icon="fire" iconColor={COLORS.warning} color={COLORS.warning} />
          <StatCard label="Best" value={stats.longestStreak} icon="star" iconColor={COLORS.warning} />
          <StatCard
            label="Learned"
            value={`${lettersLearned}/26`}
            icon="check-circle"
            iconColor={COLORS.success}
            color={COLORS.success}
          />
        </View>

        {/* Letter Grid */}
        <Text style={styles.sectionTitle}>Letter Accuracy</Text>
        <View style={styles.letterGrid}>
          {NATO_ALPHABET.map((entry) => {
            const ls = stats.letterStats[entry.letter];
            const bgColor = getAccuracyColor(ls.correct, ls.attempts);
            return (
              <View key={entry.letter} style={[styles.letterTile, { backgroundColor: bgColor }]}>
                <Text style={styles.letterTileLetter}>{entry.letter}</Text>
                {ls.attempts > 0 && (
                  <Text style={styles.letterTilePct}>
                    {formatPercent(ls.correct, ls.attempts)}%
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* 7-Day Chart */}
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        <View style={styles.chart}>
          {last7.map((date) => {
            const rec = stats.dailyRecords[date];
            const attempts = rec?.totalAttempts ?? 0;
            const heightPct = (attempts / maxAttempts) * 100;
            const accuracy = rec ? formatPercent(rec.totalCorrect, rec.totalAttempts) : 0;
            return (
              <View key={date} style={styles.chartCol}>
                <Text style={styles.chartValue}>{attempts > 0 ? attempts : ''}</Text>
                <View style={styles.chartBarTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: `${Math.max(heightPct, attempts > 0 ? 8 : 0)}%`,
                        backgroundColor:
                          accuracy >= 80
                            ? COLORS.success
                            : accuracy >= 50
                              ? COLORS.warning
                              : attempts > 0
                                ? COLORS.error
                                : 'transparent',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{getDayLabel(date)}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  letterTile: {
    width: 52,
    height: 56,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterTileLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  letterTilePct: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    height: 160,
    gap: SPACING.sm,
    alignItems: 'flex-end',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  chartBarTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderRadius: BORDER_RADIUS.sm,
    minHeight: 0,
  },
  chartLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});

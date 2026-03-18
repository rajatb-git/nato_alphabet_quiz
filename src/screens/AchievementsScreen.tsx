import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { ACHIEVEMENTS } from '../constants/achievements';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const achievements = useAchievementsStore((s) => s.achievements);
  const unlockedIds = new Set(achievements.map((a) => a.id));
  const unlockedCount = unlockedIds.size;

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
        </Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }]} />
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((def) => {
            const unlocked = unlockedIds.has(def.id);
            const achievement = achievements.find((a) => a.id === def.id);
            return (
              <View key={def.id} style={[styles.card, !unlocked && styles.cardLocked]}>
                <Text style={styles.icon}>{unlocked ? def.icon : '🔒'}</Text>
                <Text style={[styles.cardTitle, !unlocked && styles.textLocked]}>
                  {def.title}
                </Text>
                <Text style={[styles.cardDesc, !unlocked && styles.textLocked]}>
                  {def.description}
                </Text>
                {unlocked && achievement && (
                  <Text style={styles.cardDate}>
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.md },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginBottom: SPACING.md },
  progressTrack: {
    height: 6, backgroundColor: COLORS.inputBackground, borderRadius: 3,
    marginBottom: SPACING.lg, overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  grid: { gap: SPACING.sm },
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardLocked: { opacity: 0.45 },
  icon: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  textLocked: { color: COLORS.textMuted },
  cardDate: { fontSize: 11, color: COLORS.textMuted },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import StatCard from '../components/StatCard';
import { useStatsStore } from '../store/useStatsStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { formatPercent } from '../utils/helpers';
import type { HomeStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const stats = useStatsStore((s) => s.stats);
  const getTodayRecord = useStatsStore((s) => s.getTodayRecord);
  const getWeakLetters = useStatsStore((s) => s.getWeakLetters);
  const todayRecord = getTodayRecord();
  const weakLetters = getWeakLetters();

  const todayAccuracy = formatPercent(
    todayRecord.totalCorrect,
    todayRecord.totalAttempts,
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>NATO Phonetic</Text>
            <Text style={styles.title}>Alphabet Quiz</Text>
          </View>
          {stats.currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <MaterialCommunityIcons name="fire" size={20} color={COLORS.warning} />
              <Text style={styles.streakNum}>{stats.currentStreak}</Text>
            </View>
          )}
        </View>

        {/* Today's Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Today"
            value={todayRecord.totalAttempts}
            icon="pencil-box-outline"
            iconColor={COLORS.textSecondary}
          />
          <StatCard
            label="Accuracy"
            value={todayRecord.totalAttempts > 0 ? `${todayAccuracy}%` : '—'}
            icon="target"
            iconColor={COLORS.textSecondary}
            color={todayAccuracy >= 80 ? COLORS.success : todayAccuracy >= 50 ? COLORS.warning : COLORS.textSecondary}
          />
          <StatCard
            label="Sessions"
            value={todayRecord.quizSessions}
            icon="lightning-bolt"
            iconColor={COLORS.textSecondary}
          />
        </View>

        {/* Study */}
        <Text style={styles.sectionTitle}>Study</Text>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('NatoFlashcards')}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(59,130,246,0.2)' }]}>
              <MaterialCommunityIcons name="book-open-variant" size={32} color="#3b82f6" />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>NATO Flashcards</Text>
              <Text style={styles.quizCardDesc}>Review letters and their NATO words</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('MorseFlashcards')}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(236,72,153,0.2)' }]}>
              <MaterialCommunityIcons name="radio-tower" size={32} color="#ec4899" />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Morse Flashcards</Text>
              <Text style={styles.quizCardDesc}>Learn morse code patterns for each letter</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Quiz Buttons */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>Start a Quiz</Text>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('Quiz', { mode: 'random' })}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(124,58,237,0.2)' }]}>
              <MaterialCommunityIcons name="shuffle-variant" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Random Quiz</Text>
              <Text style={styles.quizCardDesc}>
                Test yourself on 10 random letters
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.textMuted}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quizCard, weakLetters.length === 0 && styles.quizCardDisabled]}
          activeOpacity={weakLetters.length > 0 ? 0.8 : 1}
          onPress={() => {
            if (weakLetters.length > 0) {
              nav.navigate('Quiz', { mode: 'weak' });
            }
          }}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
              <MaterialCommunityIcons name="target" size={32} color={COLORS.error} />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Weak Letters</Text>
              <Text style={styles.quizCardDesc}>
                {weakLetters.length > 0
                  ? `Practice ${weakLetters.length} letters you struggle with`
                  : 'Complete some quizzes first to unlock'}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.textMuted}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('Quiz', { mode: 'random', fullAlphabet: true })}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(16,185,129,0.2)' }]}>
              <MaterialCommunityIcons name="alpha-a-box" size={32} color={COLORS.success} />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Full Alphabet</Text>
              <Text style={styles.quizCardDesc}>
                All 26 letters — the ultimate challenge
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.textMuted}
            />
          </View>
        </TouchableOpacity>

        {/* More Modes */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>More Modes</Text>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('DailyChallenge')}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(245,158,11,0.2)' }]}>
              <MaterialCommunityIcons name="calendar-today" size={32} color={COLORS.warning} />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Daily Challenge</Text>
              <Text style={styles.quizCardDesc}>
                A new set of 10 letters every day
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('Spelling')}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(59,130,246,0.2)' }]}>
              <MaterialCommunityIcons name="spellcheck" size={32} color="#3b82f6" />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Spelling Mode</Text>
              <Text style={styles.quizCardDesc}>
                Spell words using NATO phonetic alphabet
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => nav.navigate('MorseCode')}
        >
          <View style={styles.quizCardContent}>
            <View style={[styles.quizIcon, { backgroundColor: 'rgba(236,72,153,0.2)' }]}>
              <MaterialCommunityIcons name="dots-horizontal" size={32} color="#ec4899" />
            </View>
            <View style={styles.quizCardText}>
              <Text style={styles.quizCardTitle}>Morse Code</Text>
              <Text style={styles.quizCardDesc}>
                Identify letters from morse code patterns
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Streak info */}
        {stats.longestStreak > 0 && (
          <View style={styles.streakInfo}>
            <Text style={styles.streakInfoText}>
              Longest streak: {stats.longestStreak} day
              {stats.longestStreak !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  streakIcon: {},
  streakNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.warning,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quizCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  quizCardDisabled: {
    opacity: 0.4,
  },
  quizCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  quizIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCardText: {
    flex: 1,
  },
  quizCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  quizCardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  streakInfo: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  streakInfoText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});

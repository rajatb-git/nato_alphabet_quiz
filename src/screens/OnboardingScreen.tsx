import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BORDER_RADIUS, COLORS, GRADIENTS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

interface Step {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    icon: 'radio-tower',
    iconColor: COLORS.primary,
    iconBg: 'rgba(124,58,237,0.2)',
    title: 'Welcome to Alpha Bravo Quiz',
    body: 'Master the NATO phonetic alphabet — the international standard used by pilots, military, and emergency services worldwide.',
  },
  {
    id: 'quiz',
    icon: 'shuffle-variant',
    iconColor: COLORS.primary,
    iconBg: 'rgba(124,58,237,0.2)',
    title: 'Test Your Knowledge',
    body: 'See a letter, type the NATO word. Random quizzes, full alphabet challenges, and targeted practice on letters you struggle with.',
  },
  {
    id: 'study',
    icon: 'book-open-variant',
    iconColor: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.2)',
    title: 'Study at Your Own Pace',
    body: 'Flip through NATO and Morse code flashcards whenever you want. No pressure — just learn and review.',
  },
  {
    id: 'streak',
    icon: 'fire',
    iconColor: COLORS.warning,
    iconBg: 'rgba(245,158,11,0.2)',
    title: 'Build a Streak',
    body: 'Practice every day to keep your streak alive. Complete the daily challenge for an extra dose of consistency.',
  },
  {
    id: 'achievements',
    icon: 'trophy',
    iconColor: COLORS.warning,
    iconBg: 'rgba(245,158,11,0.2)',
    title: 'Earn Achievements',
    body: 'Unlock 15 badges as you progress — from your very first quiz to completing 100 sessions. Ready to begin?',
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Step>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (activeIndex < STEPS.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onDone();
    }
  };

  const isLast = activeIndex === STEPS.length - 1;

  return (
    <LinearGradient colors={GRADIENTS.background} style={styles.root}>
      {/* Skip button */}
      <TouchableOpacity
        style={[styles.skipBtn, { top: insets.top + SPACING.md }]}
        onPress={onDone}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={STEPS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={[styles.slide, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 160 }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <MaterialCommunityIcons name={item.icon} size={72} color={item.iconColor} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideBody}>{item.body}</Text>
          </View>
        )}
      />

      {/* Dots + CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, isLast && styles.btnPrimary]}
          activeOpacity={0.85}
          onPress={goNext}
        >
          <Text style={[styles.btnText, isLast && styles.btnTextPrimary]}>
            {isLast ? "Let's Go!" : 'Next'}
          </Text>
          <MaterialCommunityIcons
            name={isLast ? 'check' : 'arrow-right'}
            size={20}
            color={isLast ? COLORS.text : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  slideBody: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.textMuted,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minWidth: 160,
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  btnTextPrimary: {
    color: COLORS.text,
  },
});

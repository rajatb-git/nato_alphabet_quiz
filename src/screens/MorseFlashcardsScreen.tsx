import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import { NATO_ALPHABET, MORSE_MAP } from '../constants/nato';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { shuffleArray } from '../utils/helpers';
import type { HomeStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'MorseFlashcards'>;

export default function MorseFlashcardsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState(NATO_ALPHABET);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const flipAnim = useSharedValue(0);

  const card = cards[index];
  const morse = MORSE_MAP[card.letter];

  const flip = useCallback(() => {
    const next = !flipped;
    setFlipped(next);
    flipAnim.value = withTiming(next ? 1 : 0, { duration: 300 });
  }, [flipped, flipAnim]);

  const goNext = useCallback(() => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
      flipAnim.value = withTiming(0, { duration: 150 });
    }
  }, [index, cards.length, flipAnim]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
      flipAnim.value = withTiming(0, { duration: 150 });
    }
  }, [index, flipAnim]);

  const toggleShuffle = useCallback(() => {
    if (shuffled) {
      setCards(NATO_ALPHABET);
    } else {
      setCards(shuffleArray([...NATO_ALPHABET]));
    }
    setShuffled(!shuffled);
    setIndex(0);
    setFlipped(false);
    flipAnim.value = withTiming(0, { duration: 150 });
  }, [shuffled, flipAnim]);

  const frontStyle = useAnimatedStyle(() => ({
    opacity: flipAnim.value < 0.5 ? 1 : 0,
    transform: [{ rotateY: `${flipAnim.value * 180}deg` }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: flipAnim.value >= 0.5 ? 1 : 0,
    transform: [{ rotateY: `${flipAnim.value * 180 - 180}deg` }],
  }));

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Morse Flashcards</Text>
          <TouchableOpacity onPress={toggleShuffle} style={styles.backButton}>
            <MaterialCommunityIcons
              name={shuffled ? 'sort-alphabetical-ascending' : 'shuffle-variant'}
              size={24}
              color={shuffled ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.progress}>{index + 1} / {cards.length}</Text>

        <TouchableOpacity style={styles.cardArea} activeOpacity={0.9} onPress={flip}>
          <View style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontStyle]}>
              <Text style={styles.letterText}>{card.letter}</Text>
              <Text style={styles.tapHint}>Tap to reveal</Text>
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
              {/* Morse symbols */}
              <View style={styles.morseSymbols}>
                {morse.split('').map((ch, i) => (
                  <View key={i} style={ch === '.' ? styles.dot : styles.dash} />
                ))}
              </View>
              <Text style={styles.morseText}>{morse}</Text>
              <Text style={styles.letterSmall}>{card.letter}</Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={index === 0}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, index === cards.length - 1 && styles.navBtnDisabled]}
            onPress={goNext}
            disabled={index === cards.length - 1}
          >
            <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  progress: { textAlign: 'center', fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl },
  cardContainer: { width: 240, height: 300 },
  card: {
    position: 'absolute', width: 240, height: 300,
    borderRadius: BORDER_RADIUS.xl, backgroundColor: COLORS.backgroundCard,
    borderWidth: 2, borderColor: COLORS.cardBorder,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12,
    backfaceVisibility: 'hidden',
  },
  cardBack: { backgroundColor: COLORS.primaryDark },
  letterText: { fontSize: 120, fontWeight: '800', color: COLORS.text },
  tapHint: { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  morseSymbols: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primaryLight },
  dash: { width: 48, height: 20, borderRadius: 10, backgroundColor: COLORS.primaryLight },
  morseText: { fontSize: 28, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 6 },
  letterSmall: { fontSize: 18, color: COLORS.textSecondary, marginTop: SPACING.sm },
  navRow: {
    flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  navBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.backgroundCard, borderWidth: 1, borderColor: COLORS.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  navBtnDisabled: { opacity: 0.3 },
});

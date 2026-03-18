import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import CorrectionBanner from '../components/CorrectionBanner';
import ProgressBar from '../components/ProgressBar';
import QuizSummary from '../components/QuizSummary';
import { useStatsStore } from '../store/useStatsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { useQuizFeedback } from '../hooks/useQuizFeedback';
import { correctSource, wrongSource } from '../utils/sounds';
import { NATO_ALPHABET, MORSE_MAP } from '../constants/nato';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { shuffleArray } from '../utils/helpers';
import type { HomeStackParamList } from '../navigation/RootNavigator';
import type { QuizSession, QuizQuestion } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'MorseCode'>;

function MorseDisplay({ morse, flashColor }: { morse: string; flashColor?: 'success' | 'error' | null }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const flash = useSharedValue(0);

  useEffect(() => {
    scale.value = 0.5;
    opacity.value = 0;
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    opacity.value = withSpring(1);
  }, [morse, scale, opacity]);

  useEffect(() => {
    if (flashColor) {
      flash.value = 1;
      flash.value = withTiming(0, { duration: 400 });
    }
  }, [flashColor, flash]);

  const animStyle = useAnimatedStyle(() => ({
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
    <Animated.View style={[styles.morseCard, animStyle, borderStyle]}>
      <View style={styles.morseSymbols}>
        {morse.split('').map((ch, i) => (
          <View key={i} style={ch === '.' ? styles.dot : ch === '-' ? styles.dash : styles.morseSpace} />
        ))}
      </View>
      <Text style={styles.morseText}>{morse}</Text>
    </Animated.View>
  );
}

export default function MorseCodeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const recordAnswer = useStatsStore((s) => s.recordAnswer);
  const recordSessionComplete = useStatsStore((s) => s.recordSessionComplete);
  const hapticEnabled = useSettingsStore((s) => s.settings.hapticEnabled);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  const checkAchievements = useAchievementsStore((s) => s.checkAndUnlock);

  const correctPlayer = useAudioPlayer(correctSource);
  const wrongPlayer = useAudioPlayer(wrongSource);
  const { flashColor, banner, showFeedback, dismissBanner } = useQuizFeedback();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false });
    const letters = shuffleArray(NATO_ALPHABET.map((e) => e.letter)).slice(0, 10);
    setQuestions(
      letters.map((letter) => ({
        letter, correctAnswer: letter, userAnswer: null, isCorrect: null, answeredAt: null,
      })),
    );
  }, []);

  const currentQuestion = questions[currentIndex];
  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const currentMorse = currentQuestion ? MORSE_MAP[currentQuestion.letter] : '';

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || !currentQuestion) return;

    const isCorrect = answer.trim().toUpperCase() === currentQuestion.letter;
    recordAnswer(currentQuestion.letter, isCorrect);

    const updated = [...questions];
    updated[currentIndex] = {
      ...currentQuestion, userAnswer: answer.trim(), isCorrect, answeredAt: new Date().toISOString(),
    };
    setQuestions(updated);

    if (hapticEnabled) {
      Haptics.notificationAsync(
        isCorrect ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
      );
    }
    if (soundEnabled) {
      const player = isCorrect ? correctPlayer : wrongPlayer;
      player.seekTo(0);
      player.play();
    }

    showFeedback(isCorrect, currentQuestion.letter);
    setAnswer('');

    const nextIdx = currentIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
    } else {
      recordSessionComplete('morse');
      const score = updated.filter((q) => q.isCorrect === true).length;
      const elapsed = (Date.now() - startedAt.current) / 1000;
      checkAchievements({ mode: 'morse', score, total: questions.length, quizTime: elapsed });
      setCompletedSession({
        mode: 'random', questions: updated, currentIndex: updated.length,
        startedAt: new Date(startedAt.current).toISOString(), completedAt: new Date().toISOString(),
      });
    }
  }, [answer, currentQuestion, currentIndex, questions, recordAnswer, hapticEnabled, soundEnabled, correctPlayer, wrongPlayer, showFeedback, recordSessionComplete, checkAchievements]);

  const handleDone = useCallback(() => navigation.goBack(), [navigation]);

  if (completedSession) {
    return <GradientBackground><QuizSummary session={completedSession} onDone={handleDone} /></GradientBackground>;
  }

  if (!currentQuestion) {
    return <GradientBackground><View style={[styles.loading, { paddingTop: insets.top }]}><Text style={styles.loadingText}>Loading...</Text></View></GradientBackground>;
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDone} style={styles.backButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Morse Code</Text>
            <View style={{ width: 40 }} />
          </View>

          <ProgressBar current={currentIndex} total={questions.length} correct={correctCount} />

          <View style={styles.cardArea}>
            {banner && <CorrectionBanner text={banner.text} variant={banner.variant} onDismiss={dismissBanner} />}
            <Text style={styles.promptText}>What letter is this?</Text>
            <MorseDisplay morse={currentMorse} flashColor={flashColor} />
          </View>

          <View style={styles.inputArea}>
            <View style={styles.inputRow}>
              <View style={[
                styles.letterInputField,
                flashColor === 'success' && { borderColor: COLORS.success },
                flashColor === 'error' && { borderColor: COLORS.error },
              ]}>
                <Text style={styles.letterInputText}>{answer.toUpperCase() || '?'}</Text>
              </View>
            </View>
            <View style={styles.letterGrid}>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => (
                <TouchableOpacity
                  key={ch}
                  style={[styles.gridBtn, answer.toUpperCase() === ch && styles.gridBtnActive]}
                  onPress={() => setAnswer(ch)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.gridBtnText, answer.toUpperCase() === ch && styles.gridBtnTextActive]}>{ch}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, !answer.trim() && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!answer.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: COLORS.textSecondary, fontSize: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  promptText: { fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACING.md },
  morseCard: {
    backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2, borderColor: COLORS.cardBorder, padding: SPACING.xl,
    alignItems: 'center', minWidth: 200,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12,
  },
  morseSymbols: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary },
  dash: { width: 48, height: 20, borderRadius: 10, backgroundColor: COLORS.primary },
  morseSpace: { width: SPACING.md },
  morseText: { fontSize: 32, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 8 },
  inputArea: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  inputRow: { alignItems: 'center', marginBottom: SPACING.sm },
  letterInputField: {
    width: 56, height: 56, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground, borderWidth: 2, borderColor: COLORS.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  letterInputText: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  letterGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: SPACING.xs, marginBottom: SPACING.sm,
  },
  gridBtn: {
    width: 38, height: 38, borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.inputBackground, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  gridBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  gridBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  gridBtnTextActive: { color: COLORS.text },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontSize: 18, fontWeight: '700', color: COLORS.text },
});

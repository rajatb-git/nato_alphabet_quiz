import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import ProgressBar from '../components/ProgressBar';
import QuizSummary from '../components/QuizSummary';
import { useStatsStore } from '../store/useStatsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { correctSource, wrongSource } from '../utils/sounds';
import { NATO_ALPHABET, MORSE_MAP } from '../constants/nato';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { shuffleArray } from '../utils/helpers';
import type { HomeStackParamList } from '../navigation/RootNavigator';
import type { QuizSession, QuizQuestion } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'MorseCode'>;

function MorseDisplay({ morse }: { morse: string }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = 0.5;
    opacity.value = 0;
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    opacity.value = withSpring(1);
  }, [morse, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.morseCard, animStyle]}>
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

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);
  const startedAt = useRef(new Date().toISOString());

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false });
    const letters = shuffleArray(NATO_ALPHABET.map((e) => e.letter)).slice(0, 10);
    setQuestions(
      letters.map((letter) => ({
        letter,
        correctAnswer: letter,
        userAnswer: null,
        isCorrect: null,
        answeredAt: null,
      })),
    );
  }, []);

  const currentQuestion = questions[currentIndex];
  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const currentMorse = currentQuestion ? MORSE_MAP[currentQuestion.letter] : '';

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || feedback || !currentQuestion) return;
    Keyboard.dismiss();

    const isCorrect = answer.trim().toUpperCase() === currentQuestion.letter;
    recordAnswer(currentQuestion.letter, isCorrect);

    const updated = [...questions];
    updated[currentIndex] = {
      ...currentQuestion,
      userAnswer: answer.trim(),
      isCorrect,
      answeredAt: new Date().toISOString(),
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

    setFeedback({ isCorrect, correctAnswer: currentQuestion.letter });
  }, [answer, feedback, currentQuestion, currentIndex, questions, recordAnswer, hapticEnabled, soundEnabled, correctPlayer, wrongPlayer]);

  const handleFeedbackDismiss = useCallback(() => {
    setFeedback(null);
    setAnswer('');

    const nextIdx = currentIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
    } else {
      recordSessionComplete('morse');
      const score = questions.filter((q) => q.isCorrect === true).length;
      const elapsed = (Date.now() - new Date(startedAt.current).getTime()) / 1000;
      checkAchievements({ mode: 'morse', score, total: questions.length, quizTime: elapsed });
      setCompletedSession({
        mode: 'random',
        questions,
        currentIndex: questions.length,
        startedAt: startedAt.current,
        completedAt: new Date().toISOString(),
      });
    }
  }, [currentIndex, questions, recordSessionComplete, checkAchievements]);

  const handleDone = useCallback(() => navigation.goBack(), [navigation]);

  if (completedSession) {
    return (
      <GradientBackground>
        <QuizSummary session={completedSession} onDone={handleDone} />
      </GradientBackground>
    );
  }

  if (!currentQuestion) {
    return (
      <GradientBackground>
        <View style={[styles.loading, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </GradientBackground>
    );
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

          <ProgressBar current={currentIndex + (feedback ? 1 : 0)} total={questions.length} correct={correctCount} />

          <View style={styles.cardArea}>
            <Text style={styles.promptText}>What letter is this?</Text>
            <MorseDisplay morse={currentMorse} />

            {feedback && (
              <View style={styles.feedbackOverlay}>
                <View style={[styles.feedbackBadge, { backgroundColor: feedback.isCorrect ? COLORS.success : COLORS.error }]}>
                  <MaterialCommunityIcons
                    name={feedback.isCorrect ? 'check' : 'close'}
                    size={32}
                    color={COLORS.text}
                  />
                  <Text style={styles.feedbackText}>
                    {feedback.isCorrect ? 'Correct!' : `It was ${feedback.correctAnswer}`}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Letter input - single character */}
          <View style={styles.inputArea}>
            <View style={styles.inputRow}>
              <View style={styles.letterInput}>
                <TouchableOpacity
                  style={styles.letterInputField}
                  activeOpacity={1}
                >
                  <Text style={styles.letterInputText}>
                    {answer.toUpperCase() || '?'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Letter grid for quick selection */}
            <View style={styles.letterGrid}>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => (
                <TouchableOpacity
                  key={ch}
                  style={[styles.gridBtn, answer.toUpperCase() === ch && styles.gridBtnActive]}
                  onPress={() => { if (!feedback) setAnswer(ch); }}
                  activeOpacity={0.7}
                  disabled={!!feedback}
                >
                  <Text style={[styles.gridBtnText, answer.toUpperCase() === ch && styles.gridBtnTextActive]}>
                    {ch}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.submitBtn, (!answer.trim() || !!feedback) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!answer.trim() || !!feedback}
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
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  morseSymbols: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  dash: {
    width: 48,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  morseSpace: {
    width: SPACING.md,
  },
  morseText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 8,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  feedbackText: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  inputArea: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  inputRow: { alignItems: 'center', marginBottom: SPACING.sm },
  letterInput: { alignItems: 'center' },
  letterInputField: {
    width: 56, height: 56, borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground, borderWidth: 1, borderColor: COLORS.cardBorder,
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

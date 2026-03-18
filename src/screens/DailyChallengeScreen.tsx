import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import LetterCard from '../components/LetterCard';
import AnswerInput, { type AnswerInputHandle } from '../components/AnswerInput';
import CorrectionBanner from '../components/CorrectionBanner';
import ProgressBar from '../components/ProgressBar';
import QuizSummary from '../components/QuizSummary';
import { useStatsStore } from '../store/useStatsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { useQuizFeedback } from '../hooks/useQuizFeedback';
import { correctSource, wrongSource } from '../utils/sounds';
import { NATO_MAP, NATO_ALPHABET, isCorrectAnswer } from '../constants/nato';
import { COLORS, SPACING } from '../constants/theme';
import { getTodayDate } from '../utils/helpers';
import { loadDailyChallenge, saveDailyChallenge } from '../utils/storage';
import type { HomeStackParamList } from '../navigation/RootNavigator';
import type { QuizSession, QuizQuestion } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DailyChallenge'>;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getDailyLetters(dateStr: string): string[] {
  const parts = dateStr.split('-');
  const seed = parseInt(parts.join(''), 10);
  const rng = seededRandom(seed);
  const all = NATO_ALPHABET.map((e) => e.letter);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, 10);
}

export default function DailyChallengeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<AnswerInputHandle>(null);
  const recordAnswer = useStatsStore((s) => s.recordAnswer);
  const recordSessionComplete = useStatsStore((s) => s.recordSessionComplete);
  const hapticEnabled = useSettingsStore((s) => s.settings.hapticEnabled);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  const checkAchievements = useAchievementsStore((s) => s.checkAndUnlock);

  const correctPlayer = useAudioPlayer(correctSource);
  const wrongPlayer = useAudioPlayer(wrongSource);
  const { flashColor, correction, showFeedback, dismissCorrection } = useQuizFeedback();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [previousScore, setPreviousScore] = useState<{ score: number; total: number } | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false });
    const today = getTodayDate();
    const letters = getDailyLetters(today);

    loadDailyChallenge().then((saved) => {
      if (saved && saved.date === today && saved.completed) {
        setAlreadyCompleted(true);
        setPreviousScore({ score: saved.score ?? 0, total: saved.total });
      }
    });

    setQuestions(
      letters.map((letter) => ({
        letter,
        correctAnswer: NATO_MAP[letter],
        userAnswer: null,
        isCorrect: null,
        answeredAt: null,
      })),
    );
  }, []);

  const currentQuestion = questions[currentIndex];
  const correctCount = questions.filter((q) => q.isCorrect === true).length;

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || !currentQuestion) return;

    const isCorrect = isCorrectAnswer(currentQuestion.letter, answer);
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

    showFeedback(isCorrect, currentQuestion.correctAnswer);
    setAnswer('');

    const nextIdx = currentIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentIndex(nextIdx);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      Keyboard.dismiss();
      recordSessionComplete('daily');
      const score = updated.filter((q) => q.isCorrect === true).length;
      const elapsed = (Date.now() - startedAt.current) / 1000;
      checkAchievements({ mode: 'daily', score, total: questions.length, quizTime: elapsed });

      const today = getTodayDate();
      saveDailyChallenge({
        date: today,
        seed: parseInt(today.split('-').join(''), 10),
        letters: questions.map((q) => q.letter),
        completed: true,
        score,
        total: questions.length,
      });

      setCompletedSession({
        mode: 'random',
        questions: updated,
        currentIndex: updated.length,
        startedAt: new Date(startedAt.current).toISOString(),
        completedAt: new Date().toISOString(),
      });
    }
  }, [answer, currentQuestion, currentIndex, questions, recordAnswer, hapticEnabled, soundEnabled, correctPlayer, wrongPlayer, showFeedback, recordSessionComplete, checkAchievements]);

  const handleDone = useCallback(() => navigation.goBack(), [navigation]);

  if (completedSession) {
    return <GradientBackground><QuizSummary session={completedSession} onDone={handleDone} /></GradientBackground>;
  }

  if (alreadyCompleted && previousScore) {
    return (
      <GradientBackground>
        <View style={[styles.completedContainer, { paddingTop: insets.top + SPACING.xl }]}>
          <MaterialCommunityIcons name="check-circle" size={80} color={COLORS.success} />
          <Text style={styles.completedTitle}>Already Completed!</Text>
          <Text style={styles.completedScore}>Today's score: {previousScore.score}/{previousScore.total}</Text>
          <Text style={styles.completedHint}>Come back tomorrow for a new challenge</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    );
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
            <Text style={styles.headerTitle}>Daily Challenge</Text>
            <View style={{ width: 40 }} />
          </View>

          <ProgressBar current={currentIndex} total={questions.length} correct={correctCount} />

          <View style={styles.cardArea}>
            {correction && <CorrectionBanner correctAnswer={correction} onDismiss={dismissCorrection} />}
            <LetterCard letter={currentQuestion.letter} flashColor={flashColor} />
          </View>

          <View style={styles.inputArea}>
            <AnswerInput ref={inputRef} value={answer} onChangeText={setAnswer} onSubmit={handleSubmit} flashColor={flashColor} />
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
  inputArea: { paddingBottom: SPACING.xxl },
  completedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  completedTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  completedScore: { fontSize: 20, fontWeight: '600', color: COLORS.primaryLight, marginBottom: SPACING.sm },
  completedHint: { fontSize: 15, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  doneBtn: { backgroundColor: COLORS.primary, borderRadius: 999, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md },
  doneBtnText: { fontSize: 18, fontWeight: '700', color: COLORS.text },
});

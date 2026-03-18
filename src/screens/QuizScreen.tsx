import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import LetterCard from '../components/LetterCard';
import AnswerInput from '../components/AnswerInput';
import ResultFeedback from '../components/ResultFeedback';
import ProgressBar from '../components/ProgressBar';
import QuizSummary from '../components/QuizSummary';
import { useQuizStore } from '../store/useQuizStore';
import { useStatsStore } from '../store/useStatsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { correctSource, wrongSource } from '../utils/sounds';
import { NATO_ALPHABET } from '../constants/nato';
import { COLORS, SPACING } from '../constants/theme';
import type { HomeStackParamList } from '../navigation/RootNavigator';
import type { QuizSession } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Quiz'>;

export default function QuizScreen({ route, navigation }: Props) {
  const { mode, fullAlphabet } = route.params;
  const insets = useSafeAreaInsets();

  const startQuiz = useQuizStore((s) => s.startQuiz);
  const submitAnswer = useQuizStore((s) => s.submitAnswer);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const endQuiz = useQuizStore((s) => s.endQuiz);
  const session = useQuizStore((s) => s.session);
  const getCurrentQuestion = useQuizStore((s) => s.currentQuestion);
  const currentQuestion = getCurrentQuestion();

  const recordAnswer = useStatsStore((s) => s.recordAnswer);
  const recordSessionComplete = useStatsStore((s) => s.recordSessionComplete);
  const getWeakLetters = useStatsStore((s) => s.getWeakLetters);

  const hapticEnabled = useSettingsStore((s) => s.settings.hapticEnabled);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);

  const correctPlayer = useAudioPlayer(correctSource);
  const wrongPlayer = useAudioPlayer(wrongSource);

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);

  // Start quiz on mount
  useEffect(() => {
    const allLetters = NATO_ALPHABET.map((e) => e.letter);
    if (mode === 'weak') {
      const weak = getWeakLetters();
      startQuiz('weak', weak, Math.min(weak.length, 10));
    } else if (fullAlphabet) {
      startQuiz('random', allLetters, 26);
    } else {
      startQuiz('random', allLetters, 10);
    }
  }, [mode, fullAlphabet, startQuiz, getWeakLetters]);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || feedback) return;
    Keyboard.dismiss();

    const result = submitAnswer(answer);
    recordAnswer(currentQuestion!.letter, result.isCorrect);

    if (hapticEnabled) {
      Haptics.notificationAsync(
        result.isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    }

    if (soundEnabled) {
      const player = result.isCorrect ? correctPlayer : wrongPlayer;
      player.seekTo(0);
      player.play();
    }

    setFeedback(result);
  }, [answer, feedback, submitAnswer, recordAnswer, currentQuestion, hapticEnabled, soundEnabled, correctPlayer, wrongPlayer]);

  const handleFeedbackDismiss = useCallback(() => {
    setFeedback(null);
    setAnswer('');
    const hasNext = nextQuestion();
    if (!hasNext) {
      recordSessionComplete();
      const completed = endQuiz();
      setCompletedSession(completed);
    }
  }, [nextQuestion, endQuiz, recordSessionComplete]);

  const handleDone = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!session || !currentQuestion) {
    return (
      <GradientBackground>
        <View style={[styles.loading, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </GradientBackground>
    );
  }

  const correctCount = session.questions.filter((q) => q.isCorrect === true).length;

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDone} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'weak' ? 'Weak Letters' : fullAlphabet ? 'Full Alphabet' : 'Random Quiz'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ProgressBar
          current={session.currentIndex + (feedback ? 1 : 0)}
          total={session.questions.length}
          correct={correctCount}
        />

        {/* Letter */}
        <View style={styles.cardArea}>
          <LetterCard letter={currentQuestion.letter} />

          {feedback && (
            <ResultFeedback
              isCorrect={feedback.isCorrect}
              correctAnswer={feedback.correctAnswer}
              onDismiss={handleFeedbackDismiss}
            />
          )}
        </View>

        {/* Input */}
        <View style={styles.inputArea}>
          <AnswerInput
            value={answer}
            onChangeText={setAnswer}
            onSubmit={handleSubmit}
            disabled={!!feedback}
          />
        </View>

        {/* Summary overlay */}
        {completedSession && (
          <QuizSummary session={completedSession} onDone={handleDone} />
        )}
      </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputArea: {
    paddingBottom: SPACING.xxl,
  },
});

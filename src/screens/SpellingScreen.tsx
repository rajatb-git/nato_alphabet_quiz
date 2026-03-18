import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientBackground from '../components/GradientBackground';
import AnswerInput from '../components/AnswerInput';
import ResultFeedback from '../components/ResultFeedback';
import ProgressBar from '../components/ProgressBar';
import QuizSummary from '../components/QuizSummary';
import { useStatsStore } from '../store/useStatsStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAchievementsStore } from '../store/useAchievementsStore';
import { correctSource, wrongSource } from '../utils/sounds';
import { NATO_MAP, SPELLING_WORDS } from '../constants/nato';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { shuffleArray } from '../utils/helpers';
import type { HomeStackParamList } from '../navigation/RootNavigator';
import type { QuizSession, QuizQuestion } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Spelling'>;

export default function SpellingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const recordAnswer = useStatsStore((s) => s.recordAnswer);
  const recordSessionComplete = useStatsStore((s) => s.recordSessionComplete);
  const hapticEnabled = useSettingsStore((s) => s.settings.hapticEnabled);
  const soundEnabled = useSettingsStore((s) => s.settings.soundEnabled);
  const checkAchievements = useAchievementsStore((s) => s.checkAndUnlock);

  const correctPlayer = useAudioPlayer(correctSource);
  const wrongPlayer = useAudioPlayer(wrongSource);

  const [word, setWord] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalLetters, setTotalLetters] = useState(0);
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const startedAt = useRef(new Date().toISOString());
  const questionsRef = useRef<QuizQuestion[]>([]);
  const wordsQueue = useRef<string[]>([]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false });
    // Pick 5 random words
    const picked = shuffleArray(SPELLING_WORDS).slice(0, 5);
    wordsQueue.current = picked;
    setWord(picked[0]);
    setTotalLetters(picked.reduce((sum, w) => sum + w.length, 0));
  }, []);

  const currentLetter = word[letterIndex] ?? '';
  const correctNatoWord = NATO_MAP[currentLetter] ?? '';
  const overallProgress = questionsRef.current.length + (feedback ? 1 : 0);

  const handleSubmit = useCallback(() => {
    if (!answer.trim() || feedback || !currentLetter) return;
    Keyboard.dismiss();

    const isCorrect = answer.trim().toUpperCase() === correctNatoWord.toUpperCase() ||
      (currentLetter === 'X' && ['XRAY', 'X RAY'].includes(answer.trim().toUpperCase())) ||
      (currentLetter === 'J' && answer.trim().toUpperCase() === 'JULIETT') ||
      (currentLetter === 'A' && answer.trim().toUpperCase() === 'ALFA');

    recordAnswer(currentLetter, isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);

    questionsRef.current.push({
      letter: currentLetter,
      correctAnswer: correctNatoWord,
      userAnswer: answer.trim(),
      isCorrect,
      answeredAt: new Date().toISOString(),
    });

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

    setFeedback({ isCorrect, correctAnswer: correctNatoWord });
  }, [answer, feedback, currentLetter, correctNatoWord, recordAnswer, hapticEnabled, soundEnabled, correctPlayer, wrongPlayer]);

  const handleFeedbackDismiss = useCallback(() => {
    setFeedback(null);
    setAnswer('');

    const nextLetterIdx = letterIndex + 1;
    if (nextLetterIdx < word.length) {
      setLetterIndex(nextLetterIdx);
    } else {
      // Word done, move to next word
      const nextWordIdx = wordsCompleted + 1;
      if (nextWordIdx < wordsQueue.current.length) {
        setWordsCompleted(nextWordIdx);
        setWord(wordsQueue.current[nextWordIdx]);
        setLetterIndex(0);
      } else {
        // All words done
        recordSessionComplete('spelling');
        const elapsed = (Date.now() - new Date(startedAt.current).getTime()) / 1000;
        checkAchievements({
          mode: 'spelling',
          score: correctCount,
          total: questionsRef.current.length,
          quizTime: elapsed,
        });
        setCompletedSession({
          mode: 'random',
          questions: questionsRef.current,
          currentIndex: questionsRef.current.length,
          startedAt: startedAt.current,
          completedAt: new Date().toISOString(),
        });
      }
    }
  }, [letterIndex, word, wordsCompleted, recordSessionComplete, checkAchievements, correctCount]);

  const handleDone = useCallback(() => navigation.goBack(), [navigation]);

  if (completedSession) {
    return (
      <GradientBackground>
        <QuizSummary session={completedSession} onDone={handleDone} />
      </GradientBackground>
    );
  }

  if (!word) {
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDone} style={styles.backButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Spelling Mode</Text>
            <View style={{ width: 40 }} />
          </View>

          <ProgressBar current={overallProgress} total={totalLetters} correct={correctCount} />

          {/* Word display */}
          <View style={styles.cardArea}>
            <Text style={styles.wordLabel}>Spell this word:</Text>
            <View style={styles.wordRow}>
              {word.split('').map((char, i) => (
                <View
                  key={i}
                  style={[
                    styles.letterBox,
                    i === letterIndex && styles.letterBoxActive,
                    i < letterIndex && styles.letterBoxDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.letterBoxText,
                      i === letterIndex && styles.letterBoxTextActive,
                      i < letterIndex && styles.letterBoxTextDone,
                    ]}
                  >
                    {char}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.hint}>
              Word {wordsCompleted + 1} of {wordsQueue.current.length}
            </Text>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wordLabel: { fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACING.md },
  wordRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  letterBox: {
    width: 48,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterBoxActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(124,58,237,0.15)',
  },
  letterBoxDone: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
  letterBoxText: { fontSize: 28, fontWeight: '800', color: COLORS.textMuted },
  letterBoxTextActive: { color: COLORS.primary },
  letterBoxTextDone: { color: COLORS.success },
  hint: { fontSize: 14, color: COLORS.textMuted },
  inputArea: { paddingBottom: SPACING.xxl },
});

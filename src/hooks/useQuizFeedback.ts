import { useState, useCallback, useEffect, useRef } from 'react';

export function useQuizFeedback() {
  const [flashColor, setFlashColor] = useState<'success' | 'error' | null>(null);
  const [correction, setCorrection] = useState<string | null>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showFeedback = useCallback((isCorrect: boolean, correctAnswer: string) => {
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setFlashColor(isCorrect ? 'success' : 'error');
    setCorrection(isCorrect ? null : correctAnswer);
    flashTimeout.current = setTimeout(() => setFlashColor(null), 400);
  }, []);

  const dismissCorrection = useCallback(() => setCorrection(null), []);

  useEffect(() => () => {
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
  }, []);

  return { flashColor, correction, showFeedback, dismissCorrection };
}

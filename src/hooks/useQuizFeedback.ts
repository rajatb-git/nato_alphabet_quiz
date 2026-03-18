import { useState, useCallback, useEffect, useRef } from 'react';

export interface BannerState {
  text: string;
  variant: 'success' | 'error';
}

export function useQuizFeedback() {
  const [flashColor, setFlashColor] = useState<'success' | 'error' | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showFeedback = useCallback((isCorrect: boolean, correctAnswer: string) => {
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setFlashColor(isCorrect ? 'success' : 'error');
    setBanner(
      isCorrect
        ? { text: 'Correct!', variant: 'success' }
        : { text: `Answer: ${correctAnswer}`, variant: 'error' },
    );
    flashTimeout.current = setTimeout(() => setFlashColor(null), 400);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  useEffect(() => () => {
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
  }, []);

  return { flashColor, banner, showFeedback, dismissBanner };
}

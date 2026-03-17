export interface NatoEntry {
  letter: string;
  word: string;
}

export const NATO_ALPHABET: NatoEntry[] = [
  { letter: 'A', word: 'Alpha' },
  { letter: 'B', word: 'Bravo' },
  { letter: 'C', word: 'Charlie' },
  { letter: 'D', word: 'Delta' },
  { letter: 'E', word: 'Echo' },
  { letter: 'F', word: 'Foxtrot' },
  { letter: 'G', word: 'Golf' },
  { letter: 'H', word: 'Hotel' },
  { letter: 'I', word: 'India' },
  { letter: 'J', word: 'Juliet' },
  { letter: 'K', word: 'Kilo' },
  { letter: 'L', word: 'Lima' },
  { letter: 'M', word: 'Mike' },
  { letter: 'N', word: 'November' },
  { letter: 'O', word: 'Oscar' },
  { letter: 'P', word: 'Papa' },
  { letter: 'Q', word: 'Quebec' },
  { letter: 'R', word: 'Romeo' },
  { letter: 'S', word: 'Sierra' },
  { letter: 'T', word: 'Tango' },
  { letter: 'U', word: 'Uniform' },
  { letter: 'V', word: 'Victor' },
  { letter: 'W', word: 'Whiskey' },
  { letter: 'X', word: 'X-ray' },
  { letter: 'Y', word: 'Yankee' },
  { letter: 'Z', word: 'Zulu' },
];

export const NATO_MAP: Record<string, string> = Object.fromEntries(
  NATO_ALPHABET.map((e) => [e.letter, e.word]),
);

// Accepted alternate spellings
const ALTERNATES: Record<string, string[]> = {
  'X-RAY': ['XRAY', 'X RAY'],
  JULIET: ['JULIETT'],
  ALFA: ['ALPHA'],
};

export function isCorrectAnswer(letter: string, answer: string): boolean {
  const correct = NATO_MAP[letter.toUpperCase()];
  if (!correct) return false;
  const normalizedAnswer = answer.trim().toUpperCase();
  const normalizedCorrect = correct.toUpperCase();
  if (normalizedAnswer === normalizedCorrect) return true;
  // Check alternates
  const alts = ALTERNATES[normalizedCorrect] ?? [];
  if (alts.includes(normalizedAnswer)) return true;
  // Check if the correct answer is an alternate of something
  for (const [, variants] of Object.entries(ALTERNATES)) {
    if (variants.includes(normalizedCorrect) || variants.includes(normalizedAnswer)) {
      return normalizedAnswer === normalizedCorrect;
    }
  }
  return false;
}

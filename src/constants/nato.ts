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

// Morse code mapping
export const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
};

// Common words for spelling mode (3-6 letters, practical/military themed)
export const SPELLING_WORDS = [
  'HELP', 'STOP', 'FIRE', 'MOVE', 'COPY', 'HOLD',
  'BASE', 'TEAM', 'ZONE', 'SAFE', 'CALL', 'UNIT',
  'LAND', 'FUEL', 'CAMP', 'GATE', 'CODE', 'LOCK',
  'MARK', 'PLAN', 'ROAD', 'WAVE', 'DUST', 'HAWK',
  'IRON', 'JUMP', 'KING', 'QUAD', 'VETO', 'WELD',
  'EXIT', 'YORK', 'ZERO', 'NAVY', 'ARMY', 'GULF',
  'SOS', 'RUN', 'AID', 'MAP', 'HIT', 'FOG',
  'ALPHA', 'BRAVO', 'DELTA', 'OSCAR', 'TANGO', 'ROMEO',
];

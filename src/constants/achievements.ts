export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_quiz', title: 'First Steps', description: 'Complete your first quiz', icon: '🎯' },
  { id: 'perfect_10', title: 'Perfect 10', description: 'Score 100% on a 10-letter quiz', icon: '💯' },
  { id: 'perfect_26', title: 'Flawless', description: 'Score 100% on the full alphabet', icon: '👑' },
  { id: 'streak_3', title: 'On a Roll', description: 'Achieve a 3-day streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Achieve a 7-day streak', icon: '⚡' },
  { id: 'streak_30', title: 'Monthly Master', description: 'Achieve a 30-day streak', icon: '🏆' },
  { id: 'all_learned', title: 'Scholar', description: 'Learn all 26 letters (70%+ accuracy)', icon: '📚' },
  { id: 'sessions_10', title: 'Dedicated', description: 'Complete 10 quiz sessions', icon: '💪' },
  { id: 'sessions_50', title: 'Veteran', description: 'Complete 50 quiz sessions', icon: '🎖️' },
  { id: 'sessions_100', title: 'Centurion', description: 'Complete 100 quiz sessions', icon: '🏅' },
  { id: 'spelling_first', title: 'Speller', description: 'Complete a spelling challenge', icon: '✍️' },
  { id: 'morse_first', title: 'Morse Operator', description: 'Complete a morse code quiz', icon: '📡' },
  { id: 'daily_first', title: 'Daily Player', description: 'Complete a daily challenge', icon: '📅' },
  { id: 'daily_7', title: 'Weekly Regular', description: 'Complete 7 daily challenges', icon: '🗓️' },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a quiz in under 30 seconds', icon: '⏱️' },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

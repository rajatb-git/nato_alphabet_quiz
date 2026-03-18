import { Audio } from 'expo-av';

let correctSound: Audio.Sound | null = null;
let wrongSound: Audio.Sound | null = null;

export async function loadSounds(): Promise<void> {
  try {
    const { sound: cs } = await Audio.Sound.createAsync(
      require('../../assets/sounds/correct.wav'),
    );
    correctSound = cs;

    const { sound: ws } = await Audio.Sound.createAsync(
      require('../../assets/sounds/wrong.wav'),
    );
    wrongSound = ws;
  } catch {
    // Sounds are optional — don't crash if loading fails
  }
}

export async function playCorrect(): Promise<void> {
  try {
    if (correctSound) {
      await correctSound.replayAsync();
    }
  } catch {
    // ignore playback errors
  }
}

export async function playWrong(): Promise<void> {
  try {
    if (wrongSound) {
      await wrongSound.replayAsync();
    }
  } catch {
    // ignore playback errors
  }
}

export const gameSoundEvents = [
  { id: "roll", label: "Roll dice" },
  { id: "select", label: "Select dice" },
  { id: "bank", label: "Bank score" },
  { id: "farkle", label: "Farkle" },
  { id: "turnStart", label: "Next turn" },
  { id: "win", label: "Win game" },
] as const;

export type GameSoundEvent = (typeof gameSoundEvents)[number]["id"];

export type GameSoundConfig = {
  src: string;
  volume?: number;
};

export type GameSoundMap = Partial<Record<GameSoundEvent, GameSoundConfig>>;

/**
 * Developer sound hooks.
 *
 * Add audio files under public/sounds, then map the event here, for example:
 * roll: { src: "/sounds/roll.mp3", volume: 0.7 }
 *
 * Leaving an event undefined falls back to the generated tone when table
 * feedback is enabled.
 */
export const gameSounds: GameSoundMap = {
  roll: { src: "/sounds/dice-roll.mp3", volume: 0.7 },
  select: { src: "/sounds/click.mp3", volume: 0.7 },
  bank: { src: "/sounds/bank.mp3", volume: 0.7 },
  farkle: { src: "/sounds/farkle.mp3", volume: 0.7 },
  turnStart: { src: "/sounds/whoosh.mp3", volume: 0.7 },
  win: { src: "/sounds/win.mp3", volume: 0.7 },
};

type FeedbackWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const fallbackFrequencies: Record<GameSoundEvent, number> = {
  bank: 520,
  farkle: 140,
  roll: 320,
  select: 420,
  turnStart: 620,
  win: 740,
};

export function playGameSound(event: GameSoundEvent, enabled: boolean): void {
  if (!enabled || typeof window === "undefined") return;

  const sound = gameSounds[event];
  if (sound) {
    const audio = new Audio(sound.src);
    audio.volume = sound.volume ?? 0.7;
    void audio.play().catch(() => undefined);
    return;
  }

  if ("vibrate" in navigator) {
    navigator.vibrate(event === "farkle" ? [70, 30, 70] : 35);
  }

  const feedbackWindow = window as FeedbackWindow;
  const AudioContextCtor =
    feedbackWindow.AudioContext ?? feedbackWindow.webkitAudioContext;
  if (!AudioContextCtor) return;

  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = fallbackFrequencies[event];
  gain.gain.value = 0.03;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.08);
}

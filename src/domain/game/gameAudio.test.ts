import { afterEach, describe, expect, it, vi } from "vitest";
import { gameSounds, playGameSound } from "./gameAudio";
import type { GameSoundConfig } from "./gameAudio";

const originalSelectSound = gameSounds.select;
const originalAudio = globalThis.Audio;
const originalAudioContext = globalThis.AudioContext;
const originalVibrate = navigator.vibrate;

describe("game audio", () => {
  afterEach(() => {
    gameSounds.select = originalSelectSound;
    globalThis.Audio = originalAudio;
    globalThis.AudioContext = originalAudioContext;
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: originalVibrate,
    });
    vi.restoreAllMocks();
  });

  it("does not play anything when feedback is disabled", () => {
    const audio = vi.fn();
    globalThis.Audio = audio as unknown as typeof Audio;

    playGameSound("roll", false);

    expect(audio).not.toHaveBeenCalled();
  });

  it("plays mapped custom sound files", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = vi.fn(function AudioMock(this: { play: typeof play; src: string; volume: number }, src: string) {
      this.play = play;
      this.src = src;
      this.volume = 1;
    });
    globalThis.Audio = audio as unknown as typeof Audio;

    playGameSound("roll", true);

    expect(audio).toHaveBeenCalledWith("/sounds/dice-roll.mp3");
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("uses generated feedback when no custom sound is mapped", () => {
    const vibrate = vi.fn();
    const oscillator = {
      connect: vi.fn(),
      frequency: { value: 0 },
      start: vi.fn(),
      stop: vi.fn(),
    };
    const gain = {
      connect: vi.fn(),
      gain: { value: 0 },
    };
    const context = {
      createGain: vi.fn(() => gain),
      createOscillator: vi.fn(() => oscillator),
      currentTime: 10,
      destination: {},
    };
    const AudioContextMock = vi.fn(function AudioContextMock() {
      return context;
    });

    gameSounds.select = undefined as GameSoundConfig | undefined;
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vibrate,
    });
    globalThis.AudioContext =
      AudioContextMock as unknown as typeof AudioContext;

    playGameSound("select", true);

    expect(vibrate).toHaveBeenCalledWith(35);
    expect(AudioContextMock).toHaveBeenCalledTimes(1);
    expect(oscillator.frequency.value).toBe(420);
    expect(oscillator.start).toHaveBeenCalledTimes(1);
    expect(oscillator.stop).toHaveBeenCalledWith(10.08);
  });
});

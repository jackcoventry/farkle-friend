import type { DiceRandomSource } from '@/domain/game/dice';

declare global {
  interface Window {
    __FARKLE_DICE_RANDOM__?: DiceRandomSource;
  }
}

export function getConfiguredDiceRandomSource(): DiceRandomSource | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.__FARKLE_DICE_RANDOM__;
}

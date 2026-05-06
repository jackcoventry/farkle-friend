'use client';

import { useEffect } from 'react';

type DiceKeyboardShortcutsArgs = {
  canBank: boolean;
  canFinish: boolean;
  canRoll: boolean;
  currentRollLength: number;
  onBank: () => void;
  onFinish: () => void;
  onRoll: () => void;
  onToggleDie: (index: number) => void;
};

export function useDiceKeyboardShortcuts({
  canBank,
  canFinish,
  canRoll,
  currentRollLength,
  onBank,
  onFinish,
  onRoll,
  onToggleDie,
}: DiceKeyboardShortcutsArgs) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreShortcut(event)) return;

      const key = event.key.toLowerCase();
      const dieNumber = Number(key);

      if (Number.isInteger(dieNumber) && dieNumber >= 1 && dieNumber <= 6) {
        if (dieNumber <= currentRollLength) {
          event.preventDefault();
          onToggleDie(dieNumber - 1);
        }
        return;
      }

      if (key === 'r' && canRoll) {
        event.preventDefault();
        onRoll();
        return;
      }

      if (key === 'b' && canBank) {
        event.preventDefault();
        onBank();
        return;
      }

      if (event.key === 'Enter' && canFinish) {
        event.preventDefault();
        onFinish();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [canBank, canFinish, canRoll, currentRollLength, onBank, onFinish, onRoll, onToggleDie]);
}

function shouldIgnoreShortcut(event: KeyboardEvent): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return true;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || target.matches('input, textarea, select, button, a');
}

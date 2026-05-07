'use client';

import { useEffect, useReducer } from 'react';
import * as z from 'zod/mini';
import { createInitialGameState } from '@/domain/game/gameLogic';
import { reducer } from '@/domain/game/gameReducer';
import type { GamePreferences, GameSettings, GameState } from '@/domain/game/gameTypes';

const STORAGE_KEY = 'farkle-friend-settings';
const storedSettingsSchema = z.object({
  preferences: z.optional(
    z.partial(
      z.object({
        motionEnabled: z.boolean(),
        locale: z.enum(['en', 'es']),
        tableFeedback: z.boolean(),
        theme: z.enum(['system', 'light', 'dark']),
      })
    )
  ),
  settings: z.optional(
    z.partial(
      z.object({
        autoAdvanceTurns: z.boolean(),
        diceStyle: z.enum(['default', 'medieval']),
        mode: z.enum(['dice', 'manual']),
        targetScore: z.number().check(z.int(), z.minimum(500), z.maximum(50000)),
        showComboSuggestions: z.boolean(),
      })
    )
  ),
});

type StoredSettings = {
  preferences?: Partial<GamePreferences>;
  settings?: Partial<GameSettings>;
};

function readStoredSettings(): StoredSettings | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = storedSettingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function createInitialState(): GameState {
  const initialState = createInitialGameState();
  const stored = readStoredSettings();

  if (!stored) return initialState;

  return {
    ...initialState,
    preferences: {
      ...initialState.preferences,
      ...stored.preferences,
    },
    settings: {
      ...initialState.settings,
      ...stored.settings,
    },
  };
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preferences: state.preferences,
          settings: state.settings,
        })
      );
    } catch {
      // Local storage can be unavailable in private or restricted browser modes.
    }
  }, [state.preferences, state.settings]);

  return { state, dispatch };
}

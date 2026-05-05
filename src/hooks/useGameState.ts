"use client";

import { useEffect, useReducer } from "react";
import type { GamePreferences, GameSettings, GameState } from "@/domain/game/gameTypes";
import { createInitialGameState } from "@/domain/game/gameLogic";
import { reducer } from "@/domain/game/gameReducer";

const STORAGE_KEY = "farkle-friend-settings";

type StoredSettings = {
  preferences?: Partial<GamePreferences>;
  settings?: Partial<GameSettings>;
};

function readStoredSettings(): StoredSettings | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSettings;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
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
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        preferences: state.preferences,
        settings: state.settings,
      }),
    );
  }, [state.preferences, state.settings]);

  return { state, dispatch };
}

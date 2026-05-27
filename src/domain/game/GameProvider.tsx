'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameState } from '@/domain/game/gameTypes';

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  settingsReady: boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: React.ReactNode;
};

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
};

export function GameProvider({ children }: Readonly<GameProviderProps>) {
  const value = useGameState();

  useEffect(() => {
    document.documentElement.dataset.motion = value.state.preferences.motionEnabled ? 'on' : 'off';
  }, [value.state.preferences.motionEnabled]);

  useEffect(() => {
    const systemThemeQuery: LegacyMediaQueryList = window.matchMedia(
      '(prefers-color-scheme: light)'
    );
    const syncSystemTheme = () => {
      document.documentElement.dataset.systemTheme = systemThemeQuery.matches ? 'light' : 'dark';
    };

    syncSystemTheme();

    if (value.state.preferences.theme === 'system') {
      delete document.documentElement.dataset.theme;
      document.documentElement.dataset.themeReady = 'true';

      if (typeof systemThemeQuery.addEventListener === 'function') {
        systemThemeQuery.addEventListener('change', syncSystemTheme);
      } else {
        systemThemeQuery.addListener?.(syncSystemTheme);
      }

      return () => {
        if (typeof systemThemeQuery.removeEventListener === 'function') {
          systemThemeQuery.removeEventListener('change', syncSystemTheme);
        } else {
          systemThemeQuery.removeListener?.(syncSystemTheme);
        }
      };
    }

    document.documentElement.dataset.theme = value.state.preferences.theme;
    document.documentElement.dataset.themeReady = 'true';
  }, [value.state.preferences.theme]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider />');
  return ctx;
}

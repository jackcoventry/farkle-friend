'use client';

import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export type LobbyScreen = 'players' | 'settings';

export function useLobbyTabs() {
  const [lobbyScreen, setLobbyScreen] = useState<LobbyScreen>('players');
  const playersTabRef = useRef<HTMLButtonElement | null>(null);
  const settingsTabRef = useRef<HTMLButtonElement | null>(null);

  const selectLobbyScreen = useCallback((screen: LobbyScreen) => {
    setLobbyScreen(screen);
    const tab = screen === 'players' ? playersTabRef : settingsTabRef;
    globalThis.requestAnimationFrame(() => tab.current?.focus());
  }, []);

  const onLobbyTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const nextScreen = lobbyScreen === 'players' ? 'settings' : 'players';

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        selectLobbyScreen(nextScreen);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        selectLobbyScreen('players');
      }

      if (event.key === 'End') {
        event.preventDefault();
        selectLobbyScreen('settings');
      }
    },
    [lobbyScreen, selectLobbyScreen]
  );

  return {
    lobbyScreen,
    onLobbyTabKeyDown,
    playersTabRef,
    selectLobbyScreen,
    setLobbyScreen,
    settingsTabRef,
  };
}

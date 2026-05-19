'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import { useWarnBeforeUnload } from '@/hooks/useWarnBeforeUnload';
import type { GameAction } from '@/domain/game/gameReducer';
import { shouldWarnBeforeUnload } from '@/domain/game/gameSelectors';
import type { GameState } from '@/domain/game/gameTypes';
import type { AddPlayerFormSchemaType } from '@/components/Form/AddPlayer/AddPlayer';
import type { SettingsFormSchemaType } from '@/components/Form/Settings/Settings';
import type { ConfirmGameAction } from '@/components/GameActions/ConfirmGameActionModal';
import type { LobbyScreen } from './useLobbyTabs';

type UseGameActionsArgs = {
  dispatch: Dispatch<GameAction>;
  setLobbyScreen: Dispatch<SetStateAction<LobbyScreen>>;
  state: GameState;
};

export function useGameActions({ dispatch, setLobbyScreen, state }: UseGameActionsArgs) {
  const [confirmAction, setConfirmAction] = useState<ConfirmGameAction>(null);

  useWarnBeforeUnload(shouldWarnBeforeUnload(state));

  const onAddPlayerFormSubmit = useCallback(
    (data: AddPlayerFormSchemaType) => {
      dispatch({
        type: 'ADD_PLAYER',
        username: data.username,
        avatar: data.avatar,
      });
    },
    [dispatch]
  );

  const onSettingsSubmit = useCallback(
    (data: SettingsFormSchemaType) => {
      const { locale, motionEnabled, tableFeedback, theme, ...settings } = data;

      dispatch({
        type: 'UPDATE_SETTINGS',
        settings,
      });
      dispatch({
        type: 'UPDATE_PREFERENCES',
        preferences: {
          locale,
          motionEnabled,
          tableFeedback,
          theme,
        },
      });
      setLobbyScreen('players');
    },
    [dispatch, setLobbyScreen]
  );

  const onResetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const onResetPlayers = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  const onRemovePlayer = useCallback(
    (playerId: string) => {
      dispatch({ type: 'REMOVE_PLAYER', playerId });
    },
    [dispatch]
  );

  const onConfirmGameAction = useCallback(() => {
    if (confirmAction === 'restart') {
      onResetGame();
    }
    if (confirmAction === 'quit') {
      dispatch({ type: 'RESET_GAME' });
    }
    setConfirmAction(null);
  }, [confirmAction, dispatch, onResetGame]);

  const onAdvanceTurn = useCallback(() => {
    dispatch({ type: 'ADVANCE_TURN' });
  }, [dispatch]);

  const onStartGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const onQuit = useCallback(() => setConfirmAction('quit'), []);
  const onRestart = useCallback(() => setConfirmAction('restart'), []);
  const onCloseConfirmAction = useCallback(() => setConfirmAction(null), []);

  return {
    confirmAction,
    onAddPlayerFormSubmit,
    onAdvanceTurn,
    onCloseConfirmAction,
    onConfirmGameAction,
    onQuit,
    onRemovePlayer,
    onResetGame,
    onResetPlayers,
    onRestart,
    onSettingsSubmit,
    onStartGame,
  };
}

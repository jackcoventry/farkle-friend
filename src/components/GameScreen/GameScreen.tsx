'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useWarnBeforeUnload } from '@/hooks/useWarnBeforeUnload';
import { useGame } from '@/domain/game/GameProvider';
import { AvatarId, avatarSet } from '@/domain/game/avatars';
import { getGameSummary } from '@/domain/game/gameLogic';
import {
  getCurrentPlayer,
  getGameFlowState,
  getNextPlayer,
  getWinner,
  shouldWarnBeforeUnload,
} from '@/domain/game/gameSelectors';
import type { DiceTurnMetrics } from '@/components/DiceTurnPanel/DiceTurnPanel';
import type { AddPlayerFormSchemaType } from '@/components/Form/AddPlayer/AddPlayer';
import type { SettingsFormSchemaType } from '@/components/Form/Settings/Settings';
import type { ConfirmGameAction } from '@/components/GameActions/ConfirmGameActionModal';
import { ActiveGameScreen } from '@/components/GameScreen/ActiveGameScreen';
import { LobbyGameScreen } from '@/components/GameScreen/LobbyGameScreen';

const ConfirmGameActionModal = dynamic(() =>
  import('@/components/GameActions/ConfirmGameActionModal').then(
    (module) => module.ConfirmGameActionModal
  )
);
const GameFinishedModal = dynamic(() =>
  import('@/components/GameFinishedModal/GameFinishedModal').then(
    (module) => module.GameFinishedModal
  )
);

export function GameScreen() {
  const { state, dispatch } = useGame();
  const [confirmAction, setConfirmAction] = useState<ConfirmGameAction>(null);
  const [lobbyScreen, setLobbyScreen] = useState<'players' | 'settings'>('players');
  const [diceTurnMetrics, setDiceTurnMetrics] = useState<DiceTurnMetrics | null>(null);
  const playersTabRef = useRef<HTMLButtonElement | null>(null);
  const settingsTabRef = useRef<HTMLButtonElement | null>(null);
  const summary = useMemo(() => getGameSummary(state), [state]);
  const flowState = useMemo(() => getGameFlowState(state), [state]);
  const currentPlayer = useMemo(() => getCurrentPlayer(state, summary), [state, summary]);
  const nextPlayer = useMemo(
    () => getNextPlayer(summary, state.pendingTurnResult),
    [state.pendingTurnResult, summary]
  );
  const winner = useMemo(() => getWinner(summary), [summary]);
  const avatar = useMemo(() => avatarSet[currentPlayer?.avatar as AvatarId], [currentPlayer]);

  useWarnBeforeUnload(shouldWarnBeforeUnload(state));

  const onAddPlayerFormSubmit = (data: AddPlayerFormSchemaType) => {
    dispatch({
      type: 'ADD_PLAYER',
      username: data.username,
      avatar: data.avatar,
    });
  };

  const onSettingsSubmit = (data: SettingsFormSchemaType) => {
    const { motionEnabled, tableFeedback, theme, ...settings } = data;

    dispatch({
      type: 'UPDATE_SETTINGS',
      settings,
    });
    dispatch({
      type: 'UPDATE_PREFERENCES',
      preferences: {
        motionEnabled,
        tableFeedback,
        theme,
      },
    });
    setLobbyScreen('players');
  };

  const onResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME' });
  };

  const onResetPlayers = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const onRemovePlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', playerId });
  };

  const onConfirmGameAction = () => {
    if (confirmAction === 'restart') {
      onResetGame();
    }
    if (confirmAction === 'quit') {
      dispatch({ type: 'RESET_GAME' });
    }
    setConfirmAction(null);
  };

  const onAdvanceTurn = () => {
    dispatch({ type: 'ADVANCE_TURN' });
  };

  const onStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const selectLobbyScreen = (screen: 'players' | 'settings') => {
    setLobbyScreen(screen);
    const tab = screen === 'players' ? playersTabRef : settingsTabRef;
    globalThis.requestAnimationFrame(() => tab.current?.focus());
  };

  const onLobbyTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
  };

  if (flowState === 'LOBBY') {
    return (
      <LobbyGameScreen
        lobbyScreen={lobbyScreen}
        onAddPlayerFormSubmit={onAddPlayerFormSubmit}
        onLobbyTabKeyDown={onLobbyTabKeyDown}
        onRemovePlayer={onRemovePlayer}
        onSelectLobbyScreen={selectLobbyScreen}
        onSettingsSubmit={onSettingsSubmit}
        onStartGame={onStartGame}
        playersTabRef={playersTabRef}
        settingsTabRef={settingsTabRef}
        state={state}
      />
    );
  }

  if (flowState === 'FINISHED') {
    return (
      <main>
        <h1 className="sr-only">Farkle Friend</h1>
        <GameFinishedModal
          onResetGame={onResetGame}
          onResetPlayers={onResetPlayers}
          players={summary.players}
          soundEnabled={state.preferences.tableFeedback}
          turns={state.turns}
          winner={winner}
        />
      </main>
    );
  }

  return (
    <>
      <ActiveGameScreen
        avatar={avatar}
        currentPlayer={currentPlayer}
        diceTurnMetrics={diceTurnMetrics}
        dispatch={dispatch}
        flowState={flowState}
        nextPlayer={nextPlayer}
        onAdvanceTurn={onAdvanceTurn}
        onQuit={() => setConfirmAction('quit')}
        onRestart={() => setConfirmAction('restart')}
        setDiceTurnMetrics={setDiceTurnMetrics}
        state={state}
        summary={summary}
      />
      <ConfirmGameActionModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={onConfirmGameAction}
      />
    </>
  );
}

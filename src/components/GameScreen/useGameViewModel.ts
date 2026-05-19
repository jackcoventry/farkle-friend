'use client';

import { useMemo } from 'react';
import { type AvatarId, avatarSet } from '@/domain/game/avatars';
import { canStartGame, getGameSummary } from '@/domain/game/gameLogic';
import {
  getCurrentPlayer,
  getGameFlowState,
  getNextPlayer,
  getWinner,
} from '@/domain/game/gameSelectors';
import type { GamePreferences, GameSettings, GameState, Turn } from '@/domain/game/gameTypes';

export type LobbyGameView = {
  players: GameState['players'];
  preferences: GamePreferences;
  readyToStart: boolean;
  settings: GameSettings;
};

export type ActiveGameView = {
  autoAdvanceTurns: boolean;
  mode: GameSettings['mode'];
  pendingTurnResult: GameState['pendingTurnResult'];
  tableFeedback: boolean;
  targetScore: number;
  turns: Turn[];
};

export function useGameViewModel(state: GameState) {
  const summary = useMemo(() => getGameSummary(state), [state]);
  const flowState = useMemo(() => getGameFlowState(state), [state]);
  const currentPlayer = useMemo(() => getCurrentPlayer(state, summary), [state, summary]);
  const nextPlayer = useMemo(
    () => getNextPlayer(summary, state.pendingTurnResult),
    [state.pendingTurnResult, summary]
  );
  const winner = useMemo(() => getWinner(summary), [summary]);
  const avatar = useMemo(
    () => (currentPlayer ? avatarSet[currentPlayer.avatar as AvatarId] : undefined),
    [currentPlayer]
  );
  const lobbyView = useMemo<LobbyGameView>(
    () => ({
      players: state.players,
      preferences: state.preferences,
      readyToStart: canStartGame(state),
      settings: state.settings,
    }),
    [state]
  );
  const activeView = useMemo<ActiveGameView>(
    () => ({
      autoAdvanceTurns: state.settings.autoAdvanceTurns,
      mode: state.settings.mode,
      pendingTurnResult: state.pendingTurnResult,
      tableFeedback: state.preferences.tableFeedback,
      targetScore: state.settings.targetScore,
      turns: state.turns,
    }),
    [state]
  );

  return {
    activeView,
    avatar,
    currentPlayer,
    flowState,
    lobbyView,
    nextPlayer,
    summary,
    winner,
  };
}

'use client';

import { useMemo } from 'react';
import { type AvatarId, avatarSet } from '@/domain/game/avatars';
import { getGameSummary } from '@/domain/game/gameLogic';
import {
  getCurrentPlayer,
  getGameFlowState,
  getNextPlayer,
  getWinner,
} from '@/domain/game/gameSelectors';
import type { GameState } from '@/domain/game/gameTypes';

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

  return {
    avatar,
    currentPlayer,
    flowState,
    nextPlayer,
    summary,
    winner,
  };
}

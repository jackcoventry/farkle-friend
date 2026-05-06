'use client';

import { useCallback, useMemo } from 'react';
import { getGameSummary } from '@/domain/game/gameLogic';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameState } from '@/domain/game/gameTypes';

export function useTurnController(state: GameState, dispatch: React.Dispatch<GameAction>) {
  const summary = useMemo(() => getGameSummary(state), [state]);

  const currentIndex = state.currentPlayerIndex ?? 0;
  const currentPlayer = summary.players[currentIndex] ?? null;

  const commitTurnScore = useCallback(
    (playerId: string, score: number) => {
      dispatch({
        type: 'RECORD_TURN',
        playerId,
        score,
      });
    },
    [dispatch]
  );

  return {
    summary,
    currentPlayer,
    currentIndex,
    isInProgress: state.phase === 'IN_PROGRESS',
    commitTurnScore,
  };
}

"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import { ActiveTurn, finishActiveTurn } from "@/domain/game/turnLogic";
import { useState } from "react";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function DiceTurnPanel({ state, dispatch }: DiceTurnPanelProps) {
  const currentIndex = state.currentPlayerIndex ?? 0;
  const currentPlayer = state.players[currentIndex] ?? null;

  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  if (!currentPlayer || !activeTurn) {
    return <p>No active player</p>;
  }

  const handleFinishTurn = () => {
    if (!activeTurn) return;

    const finished = finishActiveTurn(activeTurn);
    const score = finished.isFarkled ? 0 : finished.tempScore;

    dispatch({
      playerId: finished.playerId,
      score,
      type: "RECORD_TURN",
    });

    setActiveTurn(null);
    setSelectedIndices([]);
  };

  return (
    <div>
      <h2>{currentPlayer.username}'s Turn</h2>
    </div>
  );
}

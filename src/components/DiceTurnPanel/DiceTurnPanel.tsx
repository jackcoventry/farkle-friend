"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import {
  ActiveTurn,
  bankDiceFromCurrentRoll,
  finishActiveTurn,
  rollInActiveTurn,
  startActiveTurn,
} from "@/domain/game/turnLogic";
import { useEffect, useState } from "react";
import Button from "@/components/Button/Button";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function DiceTurnPanel({ state, dispatch }: DiceTurnPanelProps) {
  const currentIndex = state.currentPlayerIndex ?? 0;
  const currentPlayer = state.players[currentIndex] ?? null;

  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (state.phase === "IN_PROGRESS" && currentPlayer) {
      setActiveTurn(startActiveTurn(currentPlayer.id));
      setSelectedIndices([]);
    } else {
      setActiveTurn(null);
      setSelectedIndices([]);
    }
  }, [state.phase, currentPlayer?.id]);

  if (!currentPlayer || !activeTurn) {
    return <p>No active player</p>;
  }

  const handleRoll = () => {
    setSelectedIndices([]);
    setActiveTurn((prev) => (prev ? rollInActiveTurn(prev) : prev));
  };

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

  const toggleDieSelection = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleBankSelected = () => {
    setActiveTurn((prev) =>
      prev ? bankDiceFromCurrentRoll(prev, selectedIndices) : prev
    );
    setSelectedIndices([]);
  };

  const canRoll = !activeTurn.isFarkled && !activeTurn.isComplete;
  const canBank =
    !!activeTurn.currentRoll &&
    selectedIndices.length > 0 &&
    !activeTurn.isFarkled &&
    !activeTurn.isComplete;
  const canFinish = activeTurn.isFarkled || activeTurn.tempScore > 0;

  return (
    <div>
      <h2>{currentPlayer.username}'s Turn</h2>
      <p>Score this turn: {activeTurn.tempScore}</p>
      <p>NUmber of dice for next roll: {activeTurn.availableDice}</p>
      {activeTurn.isFarkled && <p>You've been farkled!!!!!!</p>}
      {activeTurn.currentRoll ? (
        <div>
          {activeTurn.currentRoll.map((value, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <button
                key={`${value}-${idx}`}
                type="button"
                onClick={() => toggleDieSelection(idx)}
              >
                {value} ({isSelected ? "selected" : ""})
              </button>
            );
          })}
        </div>
      ) : (
        <p>Roll the dice!</p>
      )}

      <div>
        <Button type="button" onClick={handleRoll} disabled={!canRoll}>
          Roll dice
        </Button>
        <Button type="button" onClick={handleBankSelected} disabled={!canBank}>
          Bank
        </Button>
        <Button type="button" onClick={handleFinishTurn} disabled={!canFinish}>
          End turn & Bank
        </Button>
      </div>
    </div>
  );
}

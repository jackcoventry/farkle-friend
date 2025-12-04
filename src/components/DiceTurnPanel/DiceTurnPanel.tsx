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

export function DiceTurnPanel({
  state,
  dispatch,
}: Readonly<DiceTurnPanelProps>) {
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
    setActiveTurn((prev) => {
      if (!prev) return prev;
      if (prev.isComplete || prev.isFarkled) return prev;
      if (prev.currentRoll !== null) return prev;
      return rollInActiveTurn(prev);
    });
  };

  const handleFinishTurn = () => {
    if (!activeTurn) return;

    // Start from the latest activeTurn snapshot
    let turn = activeTurn;

    // If there is a current roll and selected dice, bank them first
    if (
      turn.currentRoll &&
      selectedIndices.length > 0 &&
      !turn.isFarkled &&
      !turn.isComplete
    ) {
      turn = bankDiceFromCurrentRoll(turn, selectedIndices);
    }

    // Mark the turn complete
    const finished = finishActiveTurn(turn);

    const finalScore = finished.isFarkled ? 0 : finished.tempScore;

    // Push the final score into the main game state
    dispatch({
      type: "RECORD_TURN",
      playerId: finished.playerId,
      score: finalScore,
    });

    // Local cleanup
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

  const canRoll =
    !activeTurn.isFarkled &&
    !activeTurn.isComplete &&
    activeTurn.currentRoll === null;

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
              <Button
                key={`${value}-${idx}`}
                type="button"
                onClick={() => toggleDieSelection(idx)}
              >
                {value} ({isSelected ? "selected" : ""})
              </Button>
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
          {activeTurn.isFarkled ? "End turn" : "Bank & End turn"}
        </Button>
      </div>
    </div>
  );
}

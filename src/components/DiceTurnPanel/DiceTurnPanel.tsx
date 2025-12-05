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
import { getScoringCombinations, scoreSelectedDice } from "@/domain/game/dice";
import type { DieValue } from "@/domain/game/dice";

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

  const currentRoll = activeTurn.currentRoll;

  const heldDice: DieValue[] =
    currentRoll && selectedIndices.length > 0
      ? selectedIndices
          .map((i) => currentRoll[i])
          .filter((v): v is DieValue => v !== undefined)
      : [];

  const selectedScore =
    heldDice.length > 0 ? scoreSelectedDice(heldDice as any) : 0;

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

    if (
      !turn.isFarkled &&
      turn.currentRoll !== null &&
      selectedIndices.length === 0
    ) {
      return;
    }

    // If there is a current roll and selected dice, bank them first
    if (
      turn.currentRoll &&
      selectedIndices.length > 0 &&
      selectedScore > 0 &&
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
    if (!currentRoll || selectedIndices.length === 0) return;
    if (selectedScore <= 0) return;

    setActiveTurn((prev) =>
      prev ? bankDiceFromCurrentRoll(prev, selectedIndices) : prev
    );
    setSelectedIndices([]);
  };

  const canRoll =
    !activeTurn.isFarkled && !activeTurn.isComplete && currentRoll === null;

  const canBank =
    !!currentRoll &&
    selectedIndices.length > 0 &&
    selectedScore > 0 &&
    !activeTurn.isFarkled &&
    !activeTurn.isComplete;

  const canFinish =
    !activeTurn.isComplete &&
    (activeTurn.isFarkled ||
      (activeTurn.currentRoll === null && activeTurn.tempScore > 0));

  const currentCombos =
    activeTurn.currentRoll == null
      ? []
      : getScoringCombinations(activeTurn.currentRoll);

  return (
    <div>
      <h2>{currentPlayer.username}'s Turn</h2>
      <p>Score this turn: {activeTurn.tempScore}</p>
      <p>NUmber of dice for next roll: {activeTurn.availableDice}</p>
      {activeTurn.isFarkled && <p>You've been farkled!!!!!!</p>}
      {currentRoll ? (
        <div>
          {currentRoll.map((value, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <Button
                key={`${value}-${idx}`}
                type="button"
                onClick={() => toggleDieSelection(idx)}
                disabled={activeTurn.isFarkled}
              >
                {value} ({isSelected ? "selected" : ""})
              </Button>
            );
          })}
        </div>
      ) : (
        <p>Roll the dice!</p>
      )}

      <ul>
        {currentCombos.slice(0, 5).map((combo, index) => (
          <li key={index}>
            [{combo.dice.toSorted((a, b) => b - a).join(", ")}] → {combo.score}{" "}
            pts
          </li>
        ))}
      </ul>

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

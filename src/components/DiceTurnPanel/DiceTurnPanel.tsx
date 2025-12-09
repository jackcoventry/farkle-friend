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
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import NextPlayerSplash from "@/components/NextPlayerSplash/NextPlayerSplash";
import { getGameSummary } from "@/domain/game/gameLogic";
import Modal from "../Modal/Modal";
import "./DiceTurnPanel.css";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function DiceTurnPanel({
  state,
  dispatch,
}: Readonly<DiceTurnPanelProps>) {
  const summary = getGameSummary(state);

  const currentIndex = state.currentPlayerIndex ?? 0;
  const currentPlayer = summary.players[currentIndex] ?? null;

  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showPlayerSwitch, setShowPlayerSwitch] = useState<boolean>(false);

  const handlePlayerChange = () => {
    setShowPlayerSwitch(true);
    setTimeout(() => {
      setShowPlayerSwitch(false);
    }, 2000);
  };

  useEffect(() => {
    if (state.phase === "IN_PROGRESS" && currentPlayer) {
      setActiveTurn(startActiveTurn(currentPlayer.id));
      setSelectedIndices([]);
    } else {
      setActiveTurn(null);
      setSelectedIndices([]);
    }
  }, [state.phase, currentPlayer?.id]);

  useEffect(handlePlayerChange, [state.currentPlayerIndex]);

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

  // List possible combinations for current roll
  // TODO: add visibility in settings
  const currentCombos =
    activeTurn.currentRoll == null
      ? []
      : getScoringCombinations(activeTurn.currentRoll);

  return (
    <div className="dice-turn-panel | grid gap-3 h-full overflow-hidden">
      {showPlayerSwitch && (
        <Modal isOpen={true} ariaLabel="My simple modal" variant="splash">
          <Modal.Body>
            <NextPlayerSplash player={currentPlayer} />
          </Modal.Body>
        </Modal>
      )}

      <div className="flex gap-4">
        <div>
          <h3 className="text-white flex gap-4">
            <span className="font-sub-heading flex">ROUND SCORE:</span>
            <span className="font-sub-heading flex">
              {activeTurn.tempScore || 0}
            </span>
          </h3>
        </div>
        <div className="ml-auto">
          <div>
            <span className="flex gap-1">
              {[...new Array(activeTurn.availableDice).keys()].map((e) => (
                <DiceIcon key={e} count={e + 1} className="w-[40px]" />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {activeTurn.isFarkled ? (
          <p className="text-white font-mega">You've been farkled!!!!!!</p>
        ) : currentRoll ? (
          <div className="flex gap-3">
            {currentRoll.map((value, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <button
                  key={`${value}-${idx}`}
                  type="button"
                  onClick={() => toggleDieSelection(idx)}
                  disabled={activeTurn.isFarkled}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  className="animate-bounce-in opacity-0 w-[100px]"
                >
                  <DiceIcon
                    count={value}
                    state={isSelected ? "active" : "default"}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <h2 className="text-white font-mega">ROLL BABY, ROLL!</h2>
        )}

        {/* 

      TODO: Enable this in settings
      
      <ul>
        {currentCombos.slice(0, 5).map((combo, index) => (
          <li key={index}>
            [{combo.dice.toSorted((a, b) => b - a).join(", ")}] → {combo.score}{" "}
            pts
          </li>
        ))}
      </ul> */}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleRoll}
          disabled={!canRoll}
          className={`grow-1 justify-center ${canRoll ? "animate-bounce" : ""}`}
          size="large"
        >
          Roll dice
        </Button>
        <Button
          type="button"
          onClick={handleBankSelected}
          disabled={!canBank}
          className={`grow-1 justify-center ${canBank ? "animate-bounce" : ""}`}
          size="large"
        >
          Bank
        </Button>
        <Button
          type="button"
          onClick={handleFinishTurn}
          disabled={!canFinish}
          className={`grow-1 justify-center ${canFinish ? "animate-bounce" : ""}`}
          size="large"
        >
          {activeTurn.isFarkled ? "End turn" : "Bank & End turn"}
        </Button>
      </div>
    </div>
  );
}

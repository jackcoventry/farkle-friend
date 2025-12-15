"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { ActiveTurn } from "@/domain/game/turnLogic";
import {
  bankDiceFromCurrentRoll,
  finishActiveTurn,
  rollInActiveTurn,
  startActiveTurn,
} from "@/domain/game/turnLogic";
import { scoreSelectedDice } from "@/domain/game/dice";
import type { DieValue } from "@/domain/game/dice";

type Args = {
  phase: "LOBBY" | "IN_PROGRESS" | "FINISHED";
  playerId: string | null;
  onCommitScore: (playerId: string, score: number) => void;
};

export function useDiceTurnController({
  phase,
  playerId,
  onCommitScore,
}: Args) {
  const [activeTurn, setActiveTurn] = useState<ActiveTurn | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Start / reset turn when player changes
  useEffect(() => {
    if (phase === "IN_PROGRESS" && playerId) {
      setActiveTurn(startActiveTurn(playerId));
      setSelectedIndices([]);
    } else {
      setActiveTurn(null);
      setSelectedIndices([]);
    }
  }, [phase, playerId]);

  const currentRoll = activeTurn?.currentRoll ?? null;

  const heldDice: DieValue[] = useMemo(() => {
    if (!currentRoll || selectedIndices.length === 0) return [];
    return selectedIndices
      .map((i) => currentRoll[i])
      .filter((v): v is DieValue => v !== undefined);
  }, [currentRoll, selectedIndices]);

  const selectedScore = useMemo(() => {
    return heldDice.length > 0 ? scoreSelectedDice(heldDice) : 0;
  }, [heldDice]);

  const toggleDieSelection = useCallback((index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const roll = useCallback(() => {
    setSelectedIndices([]);
    setActiveTurn((prev) => {
      if (!prev) return prev;
      if (prev.isComplete || prev.isFarkled) return prev;
      if (prev.currentRoll !== null) return prev;
      return rollInActiveTurn(prev);
    });
  }, []);

  const bankSelected = useCallback(() => {
    if (!currentRoll || selectedIndices.length === 0) return;
    if (selectedScore <= 0) return;

    setActiveTurn((prev) =>
      prev ? bankDiceFromCurrentRoll(prev, selectedIndices) : prev
    );
    setSelectedIndices([]);
  }, [currentRoll, selectedIndices, selectedScore]);

  const finishTurn = useCallback(() => {
    if (!activeTurn || !playerId) return;

    let turn = activeTurn;

    if (
      !turn.isFarkled &&
      turn.currentRoll !== null &&
      selectedIndices.length === 0
    ) {
      return;
    }

    if (
      turn.currentRoll &&
      selectedIndices.length > 0 &&
      selectedScore > 0 &&
      !turn.isFarkled &&
      !turn.isComplete
    ) {
      turn = bankDiceFromCurrentRoll(turn, selectedIndices);
    }

    const finished = finishActiveTurn(turn);
    const finalScore = finished.isFarkled ? 0 : finished.tempScore;

    onCommitScore(finished.playerId, finalScore);

    setActiveTurn(null);
    setSelectedIndices([]);
  }, [activeTurn, playerId, selectedIndices, selectedScore, onCommitScore]);

  const canRoll =
    !!activeTurn &&
    !activeTurn.isFarkled &&
    !activeTurn.isComplete &&
    activeTurn.currentRoll === null;

  const canBank =
    !!activeTurn &&
    !!currentRoll &&
    selectedIndices.length > 0 &&
    selectedScore > 0 &&
    !activeTurn.isFarkled &&
    !activeTurn.isComplete;

  const canFinish =
    !!activeTurn &&
    !activeTurn.isComplete &&
    (activeTurn.isFarkled ||
      (activeTurn.currentRoll === null && activeTurn.tempScore > 0));

  return {
    activeTurn,
    currentRoll,
    selectedIndices,
    selectedScore,

    canRoll,
    canBank,
    canFinish,

    roll,
    bankSelected,
    finishTurn,
    toggleDieSelection,

    setSelectedIndices,
    setActiveTurn,
  };
}

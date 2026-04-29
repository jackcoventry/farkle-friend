"use client";

import { useMemo, useState } from "react";
import type { ActiveTurn } from "@/domain/game/turnLogic";
import {
  bankDiceFromCurrentRoll,
  finishActiveTurn,
  rollInActiveTurn,
  startActiveTurn,
} from "@/domain/game/turnLogic";
import {
  getScoreBreakdown,
  scoreSelectedDiceWithUsage,
} from "@/domain/game/dice";
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
  const [selectedState, setSelectedState] = useState<{
    playerId: string | null;
    indices: number[];
  }>({ playerId: null, indices: [] });

  const turnForPlayer = useMemo(() => {
    if (phase !== "IN_PROGRESS" || !playerId) return null;
    if (activeTurn?.playerId === playerId) return activeTurn;
    return startActiveTurn(playerId);
  }, [activeTurn, phase, playerId]);

  const selectedIndices = useMemo(
    () => (selectedState.playerId === playerId ? selectedState.indices : []),
    [playerId, selectedState.indices, selectedState.playerId]
  );
  const currentRoll = turnForPlayer?.currentRoll ?? null;

  const setSelectedIndices = (indices: number[]) => {
    setSelectedState({ playerId, indices });
  };

  const heldDice: DieValue[] = useMemo(() => {
    if (!currentRoll || selectedIndices.length === 0) return [];
    return selectedIndices
      .map((i) => currentRoll[i])
      .filter((v): v is DieValue => v !== undefined);
  }, [currentRoll, selectedIndices]);

  const selectedScoring = useMemo(() => {
    return heldDice.length > 0
      ? scoreSelectedDiceWithUsage(heldDice)
      : { score: 0, usedCount: 0 };
  }, [heldDice]);
  const selectedScore = selectedScoring.score;
  const selectedBreakdown = useMemo(
    () => getScoreBreakdown(heldDice),
    [heldDice]
  );
  const selectedUsesAllDice =
    heldDice.length > 0 && selectedScoring.usedCount === heldDice.length;
  const selectedHasInvalidDice = selectedScore > 0 && !selectedUsesAllDice;

  const toggleDieSelection = (index: number) => {
    setSelectedState((prev) => {
      const indices = prev.playerId === playerId ? prev.indices : [];
      return {
        playerId,
        indices: indices.includes(index)
        ? indices.filter((i) => i !== index)
          : [...indices, index],
      };
    });
  };

  const roll = () => {
    setSelectedIndices([]);
    setActiveTurn((prev) => {
      if (!playerId || phase !== "IN_PROGRESS") return null;
      const turn = prev?.playerId === playerId ? prev : startActiveTurn(playerId);
      if (turn.isComplete || turn.isFarkled) return turn;
      if (turn.currentRoll !== null) return turn;
      return rollInActiveTurn(turn);
    });
  };

  const bankSelected = () => {
    if (!currentRoll || selectedIndices.length === 0) return;
    if (selectedScore <= 0) return;

    setActiveTurn((prev) => {
      const turn =
        prev?.playerId === playerId ? prev : turnForPlayer;
      return turn ? bankDiceFromCurrentRoll(turn, selectedIndices) : turn;
    });
    setSelectedIndices([]);
  };

  const finishTurn = () => {
    if (!turnForPlayer || !playerId) return;

    let turn = turnForPlayer;

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
  };

  const canRoll =
    !!turnForPlayer &&
    !turnForPlayer.isFarkled &&
    !turnForPlayer.isComplete &&
    turnForPlayer.currentRoll === null;

  const canBank =
    !!turnForPlayer &&
    !!currentRoll &&
    selectedIndices.length > 0 &&
    selectedScore > 0 &&
    selectedUsesAllDice &&
    !turnForPlayer.isFarkled &&
    !turnForPlayer.isComplete;

  const canFinish =
    !!turnForPlayer &&
    !turnForPlayer.isComplete &&
    (turnForPlayer.isFarkled ||
      (turnForPlayer.currentRoll === null && turnForPlayer.tempScore > 0));

  return {
    activeTurn: turnForPlayer,
    currentRoll,
    selectedBreakdown,
    selectedIndices,
    selectedHasInvalidDice,
    selectedScore,
    selectedUsesAllDice,

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

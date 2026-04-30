"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import { playGameSound } from "@/domain/game/gameAudio";
import { getScoringCombinations } from "@/domain/game/dice";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import RichButton from "@/components/RichButton/RichButton";
import { useTurnController } from "@/domain/game/useTurnController";
import { useDiceTurnController } from "@/domain/game/useDiceTurnController";
import { getDiceTurnCopy } from "@/domain/game/diceTurnPresenter";
import { useCallback, useEffect } from "react";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onTurnMetricsChange?: (metrics: DiceTurnMetrics | null) => void;
};

export type DiceTurnMetrics = {
  diceLeft: number;
  roundScore: number;
};

export function DiceTurnPanel({
  state,
  dispatch,
  onTurnMetricsChange,
}: Readonly<DiceTurnPanelProps>) {
  const { currentPlayer, commitTurnScore } = useTurnController(state, dispatch);

  const dice = useDiceTurnController({
    phase: state.phase,
    playerId: currentPlayer?.id ?? null,
    onCommitScore: commitTurnScore,
  });

  const activeTurn = dice.activeTurn;
  const currentRoll = activeTurn?.currentRoll ?? null;
  const isFarkled = activeTurn?.isFarkled ?? false;
  const isHotDice =
    activeTurn?.currentRoll === null &&
    activeTurn.availableDice === 6 &&
    activeTurn.tempScore > 0;

  // List possible combinations for current roll
  const currentCombos =
    activeTurn?.currentRoll == null
      ? []
      : getScoringCombinations(activeTurn.currentRoll);
  const hasSelectedDice = dice.selectedIndices.length > 0;
  const showSelectionStatus = hasSelectedDice || isFarkled;
  const turnCopy = getDiceTurnCopy({
    canRoll: dice.canRoll,
    hasSelectedDice,
    isFarkled,
    isHotDice,
    selectedHasInvalidDice: dice.selectedHasInvalidDice,
    selectedScore: dice.selectedScore,
    tempScore: activeTurn?.tempScore ?? 0,
    usesAllDice: dice.selectedUsesAllDice,
  });
  const actionHint = getDiceActionHint({
    canBank: dice.canBank,
    canFinish: dice.canFinish,
    canRoll: dice.canRoll,
    hasCurrentRoll: !!currentRoll,
    hasSelectedDice,
    isFarkled,
    selectedHasInvalidDice: dice.selectedHasInvalidDice,
    selectedScore: dice.selectedScore,
    tempScore: activeTurn?.tempScore ?? 0,
  });
  const showActionHint = actionHint !== null;
  const tableFeedbackEnabled = state.preferences.tableFeedback;

  const playFeedback = useCallback(
    (type: "bank" | "farkle" | "roll" | "select") => {
      playGameSound(type, tableFeedbackEnabled);
    },
    [tableFeedbackEnabled]
  );

  const handleRoll = () => {
    playFeedback("roll");
    dice.roll();
  };

  const handleBank = () => {
    playFeedback("bank");
    dice.bankSelected();
  };

  const handleFinish = () => {
    dice.finishTurn();
  };

  const handleToggleDieSelection = useCallback(
    (index: number) => {
      playFeedback("select");
      dice.toggleDieSelection(index);
    },
    [dice, playFeedback]
  );

  useEffect(() => {
    if (!isFarkled) return;

    playFeedback("farkle");
  }, [isFarkled, playFeedback]);

  useEffect(() => {
    if (!activeTurn) {
      onTurnMetricsChange?.(null);
      return;
    }

    onTurnMetricsChange?.({
      diceLeft: activeTurn.availableDice,
      roundScore: activeTurn.tempScore,
    });

    return () => onTurnMetricsChange?.(null);
  }, [
    activeTurn,
    activeTurn?.availableDice,
    activeTurn?.tempScore,
    onTurnMetricsChange,
  ]);

  useDiceKeyboardShortcuts({
    canBank: dice.canBank,
    canFinish: dice.canFinish,
    canRoll: dice.canRoll,
    currentRollLength: activeTurn?.isFarkled
      ? 0
      : (dice.currentRoll?.length ?? 0),
    onBank: handleBank,
    onFinish: handleFinish,
    onRoll: handleRoll,
    onToggleDie: handleToggleDieSelection,
  });

  if (!currentPlayer || !activeTurn) {
    return <p>No active player</p>;
  }

  return (
    <div className="turn-frame | grid gap-3 h-full overflow-hidden">
      <div
        className={`rounded-lg px-4 py-3 ${
          dice.selectedHasInvalidDice
            ? "bg-red-50 text-red-800"
            : "bg-white/90 text-gray-900"
        }`}
        aria-live="polite"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading-2">{turnCopy.title}</p>
            <p className="mt-1 text-sm">{turnCopy.detail}</p>
          </div>
          {showSelectionStatus ? (
            <div className="rounded-lg bg-white/70 px-3 py-2 text-sm">
              <span className="font-body-1">Selection</span>{" "}
              <span>{turnCopy.selectedStatus}</span>
            </div>
          ) : null}
        </div>
        {dice.selectedBreakdown.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dice.selectedBreakdown.map((item) => (
              <li
                key={`${item.label}-${item.score}`}
                className="rounded-full bg-sun-100 px-3 py-1 text-gray-900"
              >
                {item.label} = {item.score}
              </li>
            ))}
          </ul>
        ) : null}
        {showActionHint ? (
          <p id="dice-action-hint" className="mt-3 text-sm font-body-1">
            {actionHint}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-col items-center justify-center gap-4 overflow-auto">
        {isFarkled ? (
          <div
            role="alert"
            className="max-w-[520px] rounded-lg border-2 border-red-200 bg-white p-5 text-center shadow-lg"
          >
            <h2 className="font-heading text-red-700">Farkle!</h2>
            <p className="mt-2">{turnCopy.detail}</p>
          </div>
        ) : null}

        {isHotDice ? (
          <div
            role="status"
            aria-live="polite"
            className="max-w-[520px] rounded-lg border-2 border-yellow-300 bg-white p-5 text-center shadow-lg"
          >
            <h2 className="font-heading text-red-700">{turnCopy.title}</h2>
            <p className="mt-2">{turnCopy.detail}</p>
          </div>
        ) : null}

        {currentRoll ? (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            {currentRoll.map((value, idx) => {
              const isSelected = dice.selectedIndices.includes(idx);
              return (
                <button
                  key={`${value}-${idx}`}
                  type="button"
                  onClick={() => handleToggleDieSelection(idx)}
                  disabled={activeTurn.isFarkled}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Deselect" : "Select"} die ${
                    idx + 1
                  } showing ${value}`}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  className={`animate-bounce-in w-[72px] cursor-pointer rounded-lg p-1 opacity-0 transition-transform hover:z-10 hover:scale-105 sm:w-[100px] ${
                    isSelected
                      ? "bg-yellow-200 ring-4 ring-yellow-400"
                      : "bg-transparent"
                  }`}
                >
                  <DiceIcon
                    count={value}
                    state={isSelected ? "active" : "default"}
                  />
                </button>
              );
            })}
          </div>
        ) : !isHotDice ? (
          <div className="max-w-[620px] rounded-lg bg-white/90 p-5 text-center shadow-lg">
            <p className="font-sub-heading text-red-700">
              {currentPlayer.username}&apos;s turn
            </p>
            <h2 className="font-heading">{turnCopy.title}</h2>
            <p className="mt-2">{turnCopy.detail}</p>
          </div>
        ) : null}

        {state.settings.showComboSuggestions && currentCombos.length > 0 ? (
          <ul className="rounded-lg bg-white/90 p-3">
            {currentCombos.slice(0, 5).map((combo, index) => (
              <li key={index}>
                [{combo.dice.toSorted((a, b) => b - a).join(", ")}] →{" "}
                {combo.score} pts
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <RichButton
          onClick={handleRoll}
          ariaDescribedBy={showActionHint ? "dice-action-hint" : undefined}
          disabled={!dice.canRoll}
          className="justify-center"
          icon="dice"
        >
          Roll dice
        </RichButton>
        <RichButton
          onClick={handleBank}
          ariaDescribedBy={showActionHint ? "dice-action-hint" : undefined}
          disabled={!dice.canBank}
          className="justify-center"
          icon="bank"
        >
          {dice.selectedScore > 0 ? `Bank ${dice.selectedScore}` : "Bank"}
        </RichButton>
        <RichButton
          onClick={handleFinish}
          ariaDescribedBy={showActionHint ? "dice-action-hint" : undefined}
          disabled={!dice.canFinish}
          className="justify-center"
          icon="rocket"
        >
          {isFarkled ? "Score 0 and end turn" : "End turn"}
        </RichButton>
      </div>
      <p className="rounded-lg bg-white/80 px-4 py-2 text-center text-sm text-gray-800">
        Shortcuts: 1-6 select dice, R roll, B bank, Enter end.
      </p>
    </div>
  );
}

type DiceActionHintArgs = {
  canBank: boolean;
  canFinish: boolean;
  canRoll: boolean;
  hasCurrentRoll: boolean;
  hasSelectedDice: boolean;
  isFarkled: boolean;
  selectedHasInvalidDice: boolean;
  selectedScore: number;
  tempScore: number;
};

function getDiceActionHint({
  canBank,
  canFinish,
  canRoll,
  hasCurrentRoll,
  hasSelectedDice,
  isFarkled,
  selectedHasInvalidDice,
  selectedScore,
  tempScore,
}: DiceActionHintArgs): string | null {
  if (isFarkled) return "End the turn to score 0 and move to the next player.";
  if (canBank && selectedScore > 0) {
    return `Bank ${selectedScore} points from this selection, or keep selecting scoring dice.`;
  }
  if (selectedHasInvalidDice) {
    return "Deselect any dice that do not score before banking this selection.";
  }
  if (hasSelectedDice) return "Selected dice do not score yet.";
  if (canRoll && tempScore > 0) {
    return "Roll again to push your luck, or end the turn to keep the round score.";
  }
  if (canFinish) return "End the turn to add the round score to your total.";
  if (canRoll) return null;
  if (hasCurrentRoll) return "Tap dice to select them, or use keys 1-6.";
  return "Roll to reveal the next dice.";
}

type DiceKeyboardShortcutsArgs = {
  canBank: boolean;
  canFinish: boolean;
  canRoll: boolean;
  currentRollLength: number;
  onBank: () => void;
  onFinish: () => void;
  onRoll: () => void;
  onToggleDie: (index: number) => void;
};

function useDiceKeyboardShortcuts({
  canBank,
  canFinish,
  canRoll,
  currentRollLength,
  onBank,
  onFinish,
  onRoll,
  onToggleDie,
}: DiceKeyboardShortcutsArgs) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreShortcut(event)) return;

      const key = event.key.toLowerCase();
      const dieNumber = Number(key);

      if (Number.isInteger(dieNumber) && dieNumber >= 1 && dieNumber <= 6) {
        if (dieNumber <= currentRollLength) {
          event.preventDefault();
          onToggleDie(dieNumber - 1);
        }
        return;
      }

      if (key === "r" && canRoll) {
        event.preventDefault();
        onRoll();
        return;
      }

      if (key === "b" && canBank) {
        event.preventDefault();
        onBank();
        return;
      }

      if (event.key === "Enter" && canFinish) {
        event.preventDefault();
        onFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canBank,
    canFinish,
    canRoll,
    currentRollLength,
    onBank,
    onFinish,
    onRoll,
    onToggleDie,
  ]);
}

function shouldIgnoreShortcut(event: KeyboardEvent): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return true;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.matches("input, textarea, select, button, a")
  );
}

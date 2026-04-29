"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import { getScoringCombinations } from "@/domain/game/dice";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import RichButton from "@/components/RichButton/RichButton";
import { useTurnController } from "@/domain/game/useTurnController";
import { useDiceTurnController } from "@/domain/game/useDiceTurnController";
import { getDiceTurnCopy } from "@/domain/game/diceTurnPresenter";
import { useEffect } from "react";

type DiceTurnPanelProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

export function DiceTurnPanel({
  state,
  dispatch,
}: Readonly<DiceTurnPanelProps>) {
  const { currentPlayer, commitTurnScore } = useTurnController(state, dispatch);

  const dice = useDiceTurnController({
    phase: state.phase,
    playerId: currentPlayer?.id ?? null,
    onCommitScore: commitTurnScore,
  });

  useDiceKeyboardShortcuts({
    canBank: dice.canBank,
    canFinish: dice.canFinish,
    canRoll: dice.canRoll,
    currentRollLength: dice.activeTurn?.isFarkled
      ? 0
      : dice.currentRoll?.length ?? 0,
    onBank: dice.bankSelected,
    onFinish: dice.finishTurn,
    onRoll: dice.roll,
    onToggleDie: dice.toggleDieSelection,
  });

  if (!currentPlayer || !dice.activeTurn) {
    return <p>No active player</p>;
  }

  const currentRoll = dice.activeTurn.currentRoll;
  const isFarkled = dice.activeTurn.isFarkled;
  const isHotDice =
    dice.activeTurn.currentRoll === null &&
    dice.activeTurn.availableDice === 6 &&
    dice.activeTurn.tempScore > 0;

  // List possible combinations for current roll
  const currentCombos =
    dice.activeTurn.currentRoll == null
      ? []
      : getScoringCombinations(dice.activeTurn.currentRoll);
  const hasSelectedDice = dice.selectedIndices.length > 0;
  const turnCopy = getDiceTurnCopy({
    canRoll: dice.canRoll,
    hasSelectedDice,
    isFarkled,
    isHotDice,
    selectedHasInvalidDice: dice.selectedHasInvalidDice,
    selectedScore: dice.selectedScore,
    tempScore: dice.activeTurn.tempScore,
    usesAllDice: dice.selectedUsesAllDice,
  });

  return (
    <div className="turn-frame | grid gap-3 h-full overflow-hidden">
      <div className="flex flex-wrap gap-4">
        <div>
          <h3 className="text-white flex gap-4" aria-live="polite">
            <span className="font-sub-heading flex">ROUND SCORE:</span>
            <span className="font-sub-heading flex">
              {dice.activeTurn.tempScore || 0}
            </span>
          </h3>
        </div>
        <div className="ml-auto">
          <div>
            <span className="flex gap-1">
              {[...new Array(dice.activeTurn.availableDice).keys()].map((e) => (
                <DiceIcon key={e} count={e + 1} className="w-[40px]" />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg px-4 py-3 ${
          dice.selectedHasInvalidDice
            ? "bg-red-50 text-red-800"
            : "bg-white/90 text-gray-900"
        }`}
        aria-live="polite"
      >
        <span className="font-heading-2">Selected:</span>{" "}
        <span>{turnCopy.selectedStatus}</span>
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
                  onClick={() => dice.toggleDieSelection(idx)}
                  disabled={dice?.activeTurn?.isFarkled}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Deselect" : "Select"} die ${
                    idx + 1
                  } showing ${value}`}
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  className="animate-bounce-in w-[72px] cursor-pointer opacity-0 transition-transform hover:z-10 hover:scale-115 sm:w-[100px]"
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

      <div className="flex flex-col gap-2 sm:flex-row">
        <RichButton
          onClick={dice.roll}
          disabled={!dice.canRoll}
          className={`grow-1 justify-center`}
          icon="dice"
        >
          Roll dice
        </RichButton>
        <RichButton
          onClick={dice.bankSelected}
          disabled={!dice.canBank}
          className={`grow-1 justify-center`}
          icon="bank"
        >
          {dice.selectedScore > 0 ? `Bank ${dice.selectedScore}` : "Bank"}
        </RichButton>
        <RichButton
          onClick={dice.finishTurn}
          disabled={!dice.canFinish}
          className={`grow-1 justify-center`}
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

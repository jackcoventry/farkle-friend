"use client";

import { GameAction } from "@/domain/game/gameReducer";
import { GameState } from "@/domain/game/gameTypes";
import { getScoringCombinations } from "@/domain/game/dice";
import DiceIcon from "@/components/DiceIcon/DiceIcon";
import RichButton from "@/components/RichButton/RichButton";
import { useTurnController } from "@/domain/game/useTurnController";
import { useDiceTurnController } from "@/domain/game/useDiceTurnController";

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

  if (!currentPlayer || !dice.activeTurn) {
    return <p>No active player</p>;
  }

  const currentRoll = dice.activeTurn.currentRoll;
  const isFarkled = dice.activeTurn.isFarkled;

  // List possible combinations for current roll
  const currentCombos =
    dice.activeTurn.currentRoll == null
      ? []
      : getScoringCombinations(dice.activeTurn.currentRoll);

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

      <div className="flex min-h-0 flex-col items-center justify-center gap-4 overflow-auto">
        {isFarkled ? (
          <div
            role="alert"
            className="max-w-[520px] rounded-lg border-2 border-red-200 bg-white p-5 text-center shadow-lg"
          >
            <h2 className="font-heading text-red-700">Farkle!</h2>
            <p className="mt-2">
              No scoring dice were rolled. This turn scores 0 points.
            </p>
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
        ) : (
          <h2 className="text-white font-mega animate-pulse">
            ROLL BABY, ROLL!
          </h2>
        )}

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
          Bank
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
    </div>
  );
}

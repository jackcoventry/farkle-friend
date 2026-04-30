"use client";

import DiceIcon from "@/components/DiceIcon/DiceIcon";
import { GamePreferences } from "@/components/GamePreferences/GamePreferences";
import type { DiceTurnMetrics } from "@/components/DiceTurnPanel/DiceTurnPanel";
import type { GameFlowState, GameState, Player } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";

type GameStatusBarProps = {
  currentPlayer: Player;
  diceTurnMetrics: DiceTurnMetrics | null;
  flowState: GameFlowState;
  state: GameState;
};

export function GameStatusBar({
  currentPlayer,
  diceTurnMetrics,
  flowState,
  state,
}: Readonly<GameStatusBarProps>) {
  return (
    <section
      className="flex flex-wrap items-center gap-3 rounded-lg bg-white/90 px-4 py-3 text-gray-900 shadow-sm"
      aria-live="polite"
    >
      <div>
        <p className="text-sm text-gray-700">
          {flowState === "TURN_RESULT" ? "Turn complete" : "Now playing"}
        </p>
        <h2 className="font-heading-2">{currentPlayer.username}</h2>
      </div>
      <dl className="ml-auto flex flex-wrap gap-4 text-sm sm:text-base">
        <div>
          <dt className="text-gray-700">
            {state.pendingTurnResult ? "Previous total" : "Current total"}
          </dt>
          <dd className="font-body-1 text-red-700">
            {formatScore(
              state.pendingTurnResult?.previousTotal ??
                currentPlayer.totalScore ??
                0,
            )}
          </dd>
        </div>
        {state.settings.mode === "dice" &&
        flowState === "TURN_ACTIVE" &&
        diceTurnMetrics ? (
          <>
            <div>
              <dt className="text-gray-700">Round score</dt>
              <dd className="font-body-1 text-red-700">
                {formatScore(diceTurnMetrics.roundScore)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-700">Dice left</dt>
              <dd className="flex items-center gap-2 font-body-1 text-red-700">
                <span>{diceTurnMetrics.diceLeft}</span>
                <span aria-hidden="true" className="hidden gap-1 sm:flex">
                  {[...new Array(diceTurnMetrics.diceLeft).keys()].map(
                    (index) => (
                      <DiceIcon
                        key={index}
                        count={index + 1}
                        className="w-[28px]"
                      />
                    ),
                  )}
                </span>
              </dd>
            </div>
          </>
        ) : null}
        {state.pendingTurnResult ? (
          <div>
            <dt className="text-gray-700">Updated total</dt>
            <dd className="font-body-1 text-red-700">
              {formatScore(state.pendingTurnResult.newTotal)}
            </dd>
          </div>
        ) : null}
      </dl>
      <GamePreferences className="w-full sm:w-auto" />
    </section>
  );
}

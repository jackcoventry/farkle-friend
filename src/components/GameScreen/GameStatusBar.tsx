"use client";

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
      className="flex flex-wrap items-center gap-3 rounded-4xl bg-gray-700 px-7 py-3 text-white border border-grey-200"
      aria-live="polite"
    >
      <div>
        <p className="text-sm text-white">
          {flowState === "TURN_RESULT" ? "Turn complete" : "Now playing"}
        </p>
        <h2 className="font-heading-2 text-pink-300">
          {currentPlayer.username}
        </h2>
      </div>
      <dl className="ml-auto flex flex-wrap gap-4 text-sm sm:text-base">
        <div>
          <dt className="text-white">
            {state.pendingTurnResult ? "Previous total" : "Current total"}
          </dt>
          <dd className="font-body-1 text-pink-300">
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
              <dt className="text-white">Round score</dt>
              <dd className="font-body-1 text-pink-300">
                {formatScore(diceTurnMetrics.roundScore)}
              </dd>
            </div>
            <div>
              <dt className="text-white">Dice left</dt>
              <dd className="flex items-center gap-2 font-body-1 text-pink-300">
                <span>{diceTurnMetrics.diceLeft}</span>
              </dd>
            </div>
          </>
        ) : null}
        {state.pendingTurnResult ? (
          <div>
            <dt className="text-white">Updated total</dt>
            <dd className="font-body-1 text-pink-300">
              {formatScore(state.pendingTurnResult.newTotal)}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

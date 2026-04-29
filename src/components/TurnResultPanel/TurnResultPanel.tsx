"use client";

import Button from "@/components/Button/Button";
import type { Player, TurnResult } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";
import { useEffect, useId, useRef } from "react";

type TurnResultPanelProps = {
  currentPlayer: Player;
  nextPlayer?: Player | null;
  onAdvanceTurn: () => void;
  result: TurnResult;
};

export function TurnResultPanel({
  currentPlayer,
  nextPlayer,
  onAdvanceTurn,
  result,
}: Readonly<TurnResultPanelProps>) {
  const actionText = result.isGameWinner ? "Show winner" : "Next player";
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, [result.playerId, result.score]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    if (event.target !== event.currentTarget) return;

    event.preventDefault();
    onAdvanceTurn();
  };

  return (
    <section
      ref={panelRef}
      aria-labelledby={titleId}
      aria-live="polite"
      className="m-auto flex w-full max-w-[560px] flex-col gap-5 rounded-lg bg-white p-6 text-center shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-red-300"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div>
        <p className="font-sub-heading text-red-700">Turn complete</p>
        <h2 id={titleId} className="font-heading">
          {currentPlayer.username}
        </h2>
      </div>
      <dl className="grid gap-3 text-left sm:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">Turn score</dt>
          <dd className="font-heading-2 text-red-700">
            {formatScore(result.score)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">Previous total</dt>
          <dd className="font-heading-2">
            {formatScore(result.previousTotal)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-100 p-4">
          <dt className="font-body-1 text-gray-700">New total</dt>
          <dd className="font-heading-2">{formatScore(result.newTotal)}</dd>
        </div>
      </dl>
      <p className="font-sub-heading">
        {result.isGameWinner
          ? `${currentPlayer.username} reached the target score.`
          : `Next up: ${nextPlayer?.username ?? "next player"}.`}
      </p>
      <Button onClick={onAdvanceTurn} className="justify-center" size="large">
        {actionText}
      </Button>
    </section>
  );
}

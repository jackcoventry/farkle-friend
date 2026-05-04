"use client";

import Button from "@/components/Button/Button";
import type { Player, TurnResult } from "@/domain/game/gameTypes";
import { formatScore } from "@/utils/formatScore";
import { useEffect, useId, useRef, useState } from "react";
import { Panel } from "../Panel/Panel";

const AUTO_ADVANCE_SECONDS = 3;

type TurnResultPanelProps = {
  autoAdvance?: boolean;
  currentPlayer: Player;
  nextPlayer?: Player | null;
  onAdvanceTurn: () => void;
  result: TurnResult;
};

export function TurnResultPanel({
  autoAdvance = false,
  currentPlayer,
  nextPlayer,
  onAdvanceTurn,
  result,
}: Readonly<TurnResultPanelProps>) {
  const actionText = result.isGameWinner ? "Show winner" : "Next player";
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [autoAdvanceDeadline] = useState(
    () => Date.now() + AUTO_ADVANCE_SECONDS * 1000,
  );
  const secondsRemaining = Math.max(
    0,
    Math.ceil((autoAdvanceDeadline - now) / 1000),
  );

  useEffect(() => {
    panelRef.current?.focus();
  }, [result.playerId, result.score]);

  useEffect(() => {
    if (!autoAdvance || result.isGameWinner) return;

    const interval = globalThis.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    const timeout = globalThis.setTimeout(
      onAdvanceTurn,
      AUTO_ADVANCE_SECONDS * 1000,
    );

    return () => {
      globalThis.clearInterval(interval);
      globalThis.clearTimeout(timeout);
    };
  }, [
    autoAdvance,
    onAdvanceTurn,
    result.isGameWinner,
    result.playerId,
    result.score,
  ]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter") return;
    if (event.target !== event.currentTarget) return;

    event.preventDefault();
    onAdvanceTurn();
  };

  return (
    <Panel
      ref={panelRef}
      aria-labelledby={titleId}
      aria-live="polite"
      className="m-auto flex w-full max-w-[560px] flex-col text-center gap-6 p-8"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div>
        <p className="font-sub-heading">Turn ended!</p>
        <h2 id={titleId} className="font-heading">
          {currentPlayer.username}
        </h2>
      </div>
      <dl className="grid gap-3 text-left sm:grid-cols-3">
        <div className="rounded-lg bg-gray-500 border border-pink-200 p-4">
          <dt className="font-body-1 ">Turn score</dt>
          <dd className="font-heading-2 text-white">
            {formatScore(result.score)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-500 border border-pink-200 p-4">
          <dt className="font-body-1 ">Previous total</dt>
          <dd className="font-heading-2">
            {formatScore(result.previousTotal)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-500 border border-pink-200 p-4">
          <dt className="font-body-1 ">New total</dt>
          <dd className="font-heading-2 text-pink-300">
            {formatScore(result.newTotal)}
          </dd>
        </div>
      </dl>
      <p className="font-sub-heading">
        {result.isGameWinner
          ? `${currentPlayer.username} reached the target score.`
          : `Next up: ${nextPlayer?.username ?? "next player"}.`}
      </p>
      {autoAdvance && !result.isGameWinner ? (
        <p className="text-sm " aria-live="polite">
          Advancing automatically in {secondsRemaining}...
        </p>
      ) : null}
      <Button onClick={onAdvanceTurn} className="justify-center" size="large">
        {actionText}
      </Button>
    </Panel>
  );
}

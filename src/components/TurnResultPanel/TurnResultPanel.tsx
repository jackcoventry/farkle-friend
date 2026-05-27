'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { useEffect, useId, useRef, useState } from 'react';
import { formatScore } from '@/utils/formatScore';
import type { Player, TurnResult } from '@/domain/game/gameTypes';
import Button from '@/components/Button/Button';
import { Panel } from '@/components/Panel/Panel';
import './TurnResultPanel.css';

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
  const { t } = useI18n();
  const actionText = result.isGameWinner ? t('turnResult.showWinner') : t('turnResult.nextPlayer');
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [autoAdvanceDeadline] = useState(() => Date.now() + AUTO_ADVANCE_SECONDS * 1000);
  const secondsRemaining = Math.max(0, Math.ceil((autoAdvanceDeadline - now) / 1000));

  useEffect(() => {
    panelRef.current?.focus();
  }, [result.playerId, result.score]);

  useEffect(() => {
    if (!autoAdvance || result.isGameWinner) return;

    const interval = globalThis.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    const timeout = globalThis.setTimeout(onAdvanceTurn, AUTO_ADVANCE_SECONDS * 1000);

    return () => {
      globalThis.clearInterval(interval);
      globalThis.clearTimeout(timeout);
    };
  }, [autoAdvance, onAdvanceTurn, result.isGameWinner, result.playerId, result.score]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter') return;
    if (event.target !== event.currentTarget) return;

    event.preventDefault();
    onAdvanceTurn();
  };

  return (
    <Panel
      ref={panelRef}
      aria-labelledby={titleId}
      aria-live="polite"
      className="turn-result-panel | gap-xl p-xl m-auto flex w-full flex-col text-center"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <dl className="gap-sm grid grid-cols-2 text-left">
        <div className="bg-surface-muted border-border p-md rounded-lg border">
          <dt className="font-body-1">{t('turnResult.turnScore')}</dt>
          <dd className="font-heading-2 text-text">{formatScore(result.score)}</dd>
        </div>
        {/* <div className="bg-surface-muted border-border p-md rounded-lg border">
          <dt className="font-body-1">{t('turnResult.previousTotal')}</dt>
          <dd className="font-heading-2">{formatScore(result.previousTotal)}</dd>
        </div> */}
        <div className="bg-surface-muted border-border p-md rounded-lg border">
          <dt className="font-body-1">{t('turnResult.newTotal')}</dt>
          <dd className="font-heading-2 text-accent">{formatScore(result.newTotal)}</dd>
        </div>
      </dl>
      <div>
        <p className="font-sub-heading">{t('turnResult.turnEnded')}</p>
        <p className="font-body text-accent">
          {result.isGameWinner
            ? t('turnResult.reachedTarget', { player: currentPlayer.username })
            : t('turnResult.nextUp', {
                player: nextPlayer?.username ?? t('turnResult.nextPlayer'),
              })}
        </p>
      </div>
      {autoAdvance && !result.isGameWinner ? (
        <p
          className="text-sm"
          aria-live="polite"
        >
          {t('turnResult.autoAdvance', { seconds: secondsRemaining })}
        </p>
      ) : null}
      <Button
        onClick={onAdvanceTurn}
        className="justify-center"
        size="default"
      >
        {actionText}
      </Button>
    </Panel>
  );
}

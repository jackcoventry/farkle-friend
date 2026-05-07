'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { formatScore } from '@/utils/formatScore';
import type { GameFlowState, GameState, Player } from '@/domain/game/gameTypes';
import type { DiceTurnMetrics } from '@/components/DiceTurnPanel/DiceTurnPanel';
import { Panel } from '@/components/Panel/Panel';

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
  const { t } = useI18n();

  return (
    <Panel>
      <div className="mb-md">
        <p className="text-text text-sm">
          {flowState === 'TURN_RESULT' ? t('status.turnComplete') : t('status.nowPlaying')}
        </p>
        <h2 className="font-heading-2 text-accent">{currentPlayer.username}</h2>
      </div>
      <dl className="gap-md ml-auto flex flex-wrap text-sm sm:text-base">
        <div>
          <dt className="text-text">
            {state.pendingTurnResult ? t('status.previousTotal') : t('status.currentTotal')}
          </dt>
          <dd className="font-body-1 text-accent">
            {formatScore(state.pendingTurnResult?.previousTotal ?? currentPlayer.totalScore ?? 0)}
          </dd>
        </div>
        {state.settings.mode === 'dice' && flowState === 'TURN_ACTIVE' && diceTurnMetrics ? (
          <>
            <div>
              <dt className="text-text">{t('status.roundScore')}</dt>
              <dd className="font-body-1 text-accent">{formatScore(diceTurnMetrics.roundScore)}</dd>
            </div>
            <div>
              <dt className="text-text">{t('status.diceLeft')}</dt>
              <dd className="gap-xs font-body-1 text-accent flex items-center">
                <span>{diceTurnMetrics.diceLeft}</span>
              </dd>
            </div>
          </>
        ) : null}
        {state.pendingTurnResult ? (
          <div>
            <dt className="text-text">{t('status.updatedTotal')}</dt>
            <dd className="font-body-1 text-accent">
              {formatScore(state.pendingTurnResult.newTotal)}
            </dd>
          </div>
        ) : null}
      </dl>
    </Panel>
  );
}

'use client';

import { formatScore } from '@/utils/formatScore';
import type { GameFlowState, GameState, Player } from '@/domain/game/gameTypes';
import type { DiceTurnMetrics } from '@/components/DiceTurnPanel/DiceTurnPanel';
import { Panel } from '../Panel/Panel';

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
    <Panel>
      <div className="mb-4">
        <p className="text-sm text-text">
          {flowState === 'TURN_RESULT' ? 'Turn complete' : 'Now playing'}
        </p>
        <h2 className="font-heading-2 score-chip">{currentPlayer.username}</h2>
      </div>
      <dl className="ml-auto flex flex-wrap gap-4 text-sm sm:text-base">
        <div>
          <dt className="text-text">
            {state.pendingTurnResult ? 'Previous total' : 'Current total'}
          </dt>
          <dd className="font-body-1 score-chip">
            {formatScore(state.pendingTurnResult?.previousTotal ?? currentPlayer.totalScore ?? 0)}
          </dd>
        </div>
        {state.settings.mode === 'dice' && flowState === 'TURN_ACTIVE' && diceTurnMetrics ? (
          <>
            <div>
              <dt className="text-text">Round score</dt>
              <dd className="font-body-1 score-chip">{formatScore(diceTurnMetrics.roundScore)}</dd>
            </div>
            <div>
              <dt className="text-text">Dice left</dt>
              <dd className="flex items-center gap-2 font-body-1 score-chip">
                <span>{diceTurnMetrics.diceLeft}</span>
              </dd>
            </div>
          </>
        ) : null}
        {state.pendingTurnResult ? (
          <div>
            <dt className="text-text">Updated total</dt>
            <dd className="font-body-1 score-chip">
              {formatScore(state.pendingTurnResult.newTotal)}
            </dd>
          </div>
        ) : null}
      </dl>
    </Panel>
  );
}

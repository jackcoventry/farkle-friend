'use client';

import type React from 'react';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameState } from '@/domain/game/gameTypes';
import { useTurnController } from '@/domain/game/useTurnController';
import '@/components/DiceTurnPanel/DiceTurnPanel.css';
import AddScoreForm, { AddScoreSchemaType } from '@/components/Form/AddScore/AddScore';
import Modal from '@/components/Modal/Modal';
import { Panel } from '@/components/Panel/Panel';

type ManualTurnProps = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isCoachOpenOnMobile?: boolean;
  onCloseMobileCoach?: () => void;
  statusSlot?: React.ReactNode;
};

export function ManualTurn({
  state,
  dispatch,
  isCoachOpenOnMobile = false,
  onCloseMobileCoach,
  statusSlot,
}: Readonly<ManualTurnProps>) {
  const { currentPlayer, isInProgress, commitTurnScore } = useTurnController(state, dispatch);

  if (!isInProgress || !currentPlayer) {
    return <p>No active player</p>;
  }

  const onAddScoreFormSubmit = (data: AddScoreSchemaType) => {
    const parsedScore = Number.isFinite(data.value) ? Number(data.value) : 0;

    const canSubmit =
      isInProgress &&
      !!currentPlayer &&
      parsedScore != null &&
      Number.isInteger(parsedScore) &&
      parsedScore >= 0;

    if (!canSubmit) return;

    commitTurnScore(currentPlayer.id, parsedScore);
  };

  const coachContent = (
    <Panel
      className="dice-turn-table__coach-panel | gap-sm text-sm flex flex-wrap"
      aria-label="Manual scoring guidance"
    >
      <div className="min-w-0 flex flex-col gap-xs">
        <p className="font-heading-2">Manual scoring</p>
        <p>Enter the turn score, then add it to bank the score and move on.</p>
      </div>
      <p className="rounded-lg bg-accent px-3 py-2 text-accent-contrast">
        Use this mode when you are rolling physical dice.
      </p>
    </Panel>
  );

  return (
    <div className="turn-frame | grid min-h-0 h-full w-full gap-xs lg:gap-sm">
      <div className="dice-turn-layout | grid h-full min-h-0 grid-cols-[1fr] grid-rows-[auto_minmax(0,1fr)] gap-xs lg:gap-md xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] xl:grid-rows-1">
        <AddScoreForm onSubmit={onAddScoreFormSubmit} />
        <aside
          className="dice-turn-rail | -order-1 xl:order-2 content-start grid gap-xs lg:gap-sm overflow-visible xl:overflow-auto xl:h-[calc(100dvh-var(--spacing-7))]"
          aria-label="Turn information"
        >
          {statusSlot}
          <div className="hidden xl:grid">{coachContent}</div>
        </aside>
      </div>

      <Modal
        id="manual-turn-coach-modal"
        isOpen={isCoachOpenOnMobile}
        onClose={onCloseMobileCoach}
        ariaLabel="Turn information"
      >
        <Modal.Panel
          size="narrow"
          className="dice-turn-coach-modal"
        >
          <Modal.Header>
            <Modal.Title className="font-heading">Turn information</Modal.Title>
            <Modal.CloseButton ariaLabel="Close turn information" />
          </Modal.Header>
          <Modal.Content>{coachContent}</Modal.Content>
        </Modal.Panel>
      </Modal>
    </div>
  );
}

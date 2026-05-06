"use client";

import type { GameState } from "@/domain/game/gameTypes";
import type { GameAction } from "@/domain/game/gameReducer";
import type React from "react";
import { useTurnController } from "@/domain/game/useTurnController";
import AddScoreForm, {
  AddScoreSchemaType,
} from "@/components/Form/AddScore/AddScore";
import "@/components/DiceTurnPanel/DiceTurnPanel.css";
import { Panel } from "@/components/Panel/Panel";
import Modal from "@/components/Modal/Modal";

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
  const { currentPlayer, isInProgress, commitTurnScore } = useTurnController(
    state,
    dispatch
  );

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
      className="dice-turn-table__coach-panel | gap-3 text-sm"
      aria-label="Manual scoring guidance"
    >
      <div className="min-w-0 flex flex-col gap-2">
        <p className="font-heading-2">Manual scoring</p>
        <p>
          Enter the turn score, then add it to bank the score and move on.
        </p>
      </div>
      <p className="rounded-lg bg-accent px-3 py-2 text-accent-contrast">
        Use this mode when you are rolling physical dice.
      </p>
    </Panel>
  );

  return (
    <div className="turn-frame | grid gap-3 h-full w-full">
      <div className="xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] grid-cols-[1fr] grid gap-4 content-start">
        <AddScoreForm onSubmit={onAddScoreFormSubmit} />
        <aside
          className="dice-turn-rail | -order-1 xl:order-2 content-start grid gap-3 overflow-auto xl:h-[calc(100dvh-var(--spacing-7))]"
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
        <Modal.Body className="dice-turn-coach-modal modal-panel modal-panel--narrow">
          <div className="modal-panel__header">
            <Modal.CloseButton ariaLabel="Close turn information" />
          </div>
          <div className="modal-panel__content">
            {coachContent}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

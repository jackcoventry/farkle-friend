'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type React from 'react';
import type { GameAction } from '@/domain/game/gameReducer';
import type { GameState } from '@/domain/game/gameTypes';
import { useTurnController } from '@/domain/game/useTurnController';
import '@/components/DiceTurnPanel/DiceTurnPanel.css';
import { AddScoreForm, AddScoreSchemaType } from '@/components/Form/AddScore/AddScore';
import { Modal } from '@/components/Modal/Modal';
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
  const { t } = useI18n();

  if (!isInProgress || !currentPlayer) {
    return <p>{t('player.noActive')}</p>;
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
      className="dice-turn-table__coach-panel | gap-sm flex flex-wrap text-sm"
      aria-label={t('manualScore.guidanceLabel')}
    >
      <div className="gap-xs flex min-w-0 flex-col">
        <p className="font-heading-2">{t('manualScore.guidanceTitle')}</p>
        <p>{t('manualScore.guidanceDetail')}</p>
      </div>
      <p className="bg-accent px-sm py-xs text-accent-contrast rounded-lg">
        {t('manualScore.physicalDiceHint')}
      </p>
    </Panel>
  );

  return (
    <div className="turn-frame | gap-xs lg:gap-sm grid h-full min-h-0 w-full">
      <div className="dice-turn-layout | gap-xs xl:gap-lg grid h-full min-h-0">
        <AddScoreForm
          onSubmit={onAddScoreFormSubmit}
          playerName={currentPlayer.username}
        />
        <aside
          className="dice-turn-rail | gap-xs lg:gap-lg grid content-start overflow-visible"
          aria-label={t('turn.information')}
        >
          {statusSlot}
          <div className="hidden xl:grid">{coachContent}</div>
        </aside>
      </div>

      <Modal
        id="manual-turn-coach-modal"
        isOpen={isCoachOpenOnMobile}
        onClose={onCloseMobileCoach}
        ariaLabel={t('turn.information')}
      >
        <Modal.Panel
          size="narrow"
          className="dice-turn-coach-modal"
        >
          <Modal.Header>
            <Modal.Title className="font-heading">{t('turn.information')}</Modal.Title>
            <Modal.CloseButton ariaLabel={t('turn.closeInformation')} />
          </Modal.Header>
          <Modal.Content>{coachContent}</Modal.Content>
        </Modal.Panel>
      </Modal>
    </div>
  );
}

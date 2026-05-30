'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/Button/Button';

type GameActionsProps = {
  onQuit: () => void;
  onRestart: () => void;
};

export function GameActions({ onQuit, onRestart }: Readonly<GameActionsProps>) {
  const { t } = useI18n();

  return (
    <>
      <Button
        onClick={onRestart}
        className="justify-center"
        size="small"
        ariaLabel={t('actions.restartGame')}
        icon="rewind"
        iconOnly
      >
        {t('actions.restartGame')}
      </Button>
      <Button
        onClick={onQuit}
        className="justify-center"
        size="small"
        variant="primary"
        ariaLabel={t('actions.quitToSetup')}
        icon="exit"
        iconOnly
      >
        {t('actions.quitToSetup')}
      </Button>
    </>
  );
}

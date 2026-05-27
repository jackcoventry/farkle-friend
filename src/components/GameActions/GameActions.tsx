'use client';

import { useI18n } from '@/i18n/I18nProvider';
import Button from '@/components/Button/Button';

type GameActionsProps = {
  onQuit: () => void;
  onRestart: () => void;
};

export function GameActions({ onQuit, onRestart }: Readonly<GameActionsProps>) {
  const { t } = useI18n();

  return (
    <section className="gap-xs mt-md flex flex-col">
      <div className="gap-xs flex flex-col">
        <Button
          onClick={onRestart}
          className="justify-center"
          size="small"
        >
          {t('actions.restartGame')}
        </Button>
        <Button
          onClick={onQuit}
          className="justify-center"
          size="small"
          variant="secondary"
        >
          {t('actions.quitToSetup')}
        </Button>
      </div>
    </section>
  );
}

'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';

export type ConfirmGameAction = 'quit' | 'restart' | null;

type ConfirmGameActionModalProps = {
  action: ConfirmGameAction;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmGameActionModal({
  action,
  onClose,
  onConfirm,
}: Readonly<ConfirmGameActionModalProps>) {
  const { t } = useI18n();

  if (!action) return null;

  const isRestart = action === 'restart';
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      variant="modal"
      theme="warning"
    >
      <Modal.Panel
        size="default"
        className="text-center"
      >
        <Modal.Header>
          <Modal.Title className="font-heading text-left">
            {isRestart ? t('confirm.restartTitle') : t('confirm.quitTitle')}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Content>
          <div className="gap-md grid">
            <p>{t('confirm.progressLost')}</p>
            <div className="gap-md flex flex-col sm:flex-row">
              <Button
                onClick={onClose}
                className="justify-center sm:flex-1"
              >
                {t('actions.keepPlaying')}
              </Button>
              <Button
                onClick={onConfirm}
                className="justify-center sm:flex-1"
                variant="secondary"
              >
                {isRestart ? t('actions.restartGame') : t('actions.quitToSetup')}
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

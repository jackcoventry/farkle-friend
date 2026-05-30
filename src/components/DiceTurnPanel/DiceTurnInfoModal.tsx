'use client';

import { useI18n } from '@/i18n/I18nProvider';
import type { ReactNode } from 'react';
import { Modal } from '@/components/Modal/Modal';

type DiceTurnInfoModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
};

export function DiceTurnInfoModal({ children, isOpen, onClose }: Readonly<DiceTurnInfoModalProps>) {
  const { t } = useI18n();

  return (
    <Modal
      id="dice-turn-coach-modal"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('turn.information')}
    >
      <Modal.Panel
        size="narrow"
        className="dice-turn-coach-modal"
      >
        <Modal.Header>
          <Modal.Title className="font-heading">{t('turn.info')}</Modal.Title>
          <Modal.CloseButton ariaLabel={t('turn.closeInformation')} />
        </Modal.Header>
        <Modal.Content>
          <div className="dice-turn-table__coach | gap-md grid">{children}</div>
        </Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

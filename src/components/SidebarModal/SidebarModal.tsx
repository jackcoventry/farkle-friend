import { useI18n } from '@/i18n/I18nProvider';
import type { ReactNode, RefObject } from 'react';
import { Modal } from '@/components/Modal/Modal';

type SidebarModalProps = {
  ariaLabel: string;
  children: ReactNode;
  closeLabel: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function SidebarModal({
  ariaLabel,
  children,
  closeLabel,
  id,
  isOpen,
  onClose,
  returnFocusRef,
}: Readonly<SidebarModalProps>) {
  const { t } = useI18n();

  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={ariaLabel}
      returnFocusRef={returnFocusRef}
    >
      <Modal.Panel
        size="narrow"
        className="game-menu-modal"
      >
        <Modal.Header>
          <Modal.Title className="font-heading">{t('actions.gameMenu')}</Modal.Title>
          <Modal.CloseButton ariaLabel={closeLabel} />
        </Modal.Header>
        <Modal.Content>{children}</Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

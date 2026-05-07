import type { ReactNode } from 'react';
import Modal from '@/components/Modal/Modal';

type SidebarModalProps = {
  ariaLabel: string;
  children: ReactNode;
  closeLabel: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export function SidebarModal({
  ariaLabel,
  children,
  closeLabel,
  id,
  isOpen,
  onClose,
}: Readonly<SidebarModalProps>) {
  return (
    <Modal
      id={id}
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={ariaLabel}
    >
      <Modal.Panel
        size="narrow"
        className="game-menu-modal"
      >
        <Modal.Header>
          <Modal.Title className="font-heading">Game menu</Modal.Title>
          <Modal.CloseButton ariaLabel={closeLabel} />
        </Modal.Header>
        <Modal.Content>{children}</Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

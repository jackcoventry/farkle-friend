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
      <Modal.Body className="game-menu-modal modal-panel modal-panel--narrow">
        <div className="modal-panel__header">
          <h2 className="font-heading">Game menu</h2>
          <Modal.CloseButton ariaLabel={closeLabel} />
        </div>
        <div className="modal-panel__content">{children}</div>
      </Modal.Body>
    </Modal>
  );
}

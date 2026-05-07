import type { ReactNode } from 'react';
import Modal from '@/components/Modal/Modal';

type DiceTurnInfoModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
};

export function DiceTurnInfoModal({ children, isOpen, onClose }: Readonly<DiceTurnInfoModalProps>) {
  return (
    <Modal
      id="dice-turn-coach-modal"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Turn information"
    >
      <Modal.Body className="dice-turn-coach-modal modal-panel modal-panel--narrow">
        <div className="modal-panel__header">
          <h2 className="font-heading">Turn info</h2>
          <Modal.CloseButton ariaLabel="Close turn information" />
        </div>
        <div className="modal-panel__content">
          <div className="dice-turn-table__coach | flex flex-col gap-4">{children}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

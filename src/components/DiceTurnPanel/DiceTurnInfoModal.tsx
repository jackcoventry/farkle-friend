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
      <Modal.Panel
        size="narrow"
        className="dice-turn-coach-modal"
      >
        <Modal.Header>
          <Modal.Title className="font-heading">Turn info</Modal.Title>
          <Modal.CloseButton ariaLabel="Close turn information" />
        </Modal.Header>
        <Modal.Content>
          <div className="dice-turn-table__coach | flex flex-col gap-md">{children}</div>
        </Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

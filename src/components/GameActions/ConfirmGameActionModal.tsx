import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';

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
  if (!action) return null;

  const isRestart = action === 'restart';
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      variant="modal"
      theme="warning"
    >
      <Modal.Body className="rounded-lg bg-surface text-text p-6 shadow-lg">
        <div className="flex max-w-[460px] flex-col gap-4 text-center">
          <Modal.Title className="font-heading">
            {isRestart ? 'Restart this game?' : 'Quit this game?'}
          </Modal.Title>
          <p>Current scores and turn progress will be lost. Players and settings will be kept.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={onClose}
              className="justify-center sm:flex-1"
            >
              Keep playing
            </Button>
            <Button
              onClick={onConfirm}
              className="justify-center sm:flex-1"
            >
              {isRestart ? 'Restart game' : 'Quit to setup'}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

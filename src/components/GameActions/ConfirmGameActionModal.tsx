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
      <Modal.Panel
        size="default"
        className="text-center"
      >
        <Modal.Header>
          <Modal.Title className="font-heading text-left">
            {isRestart ? 'Restart this game?' : 'Quit this game?'}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Content>
          <div className="grid gap-4">
            <p>Current scores and turn progress will be lost. Players and settings will be kept.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={onClose}
                className="justify-center sm:flex-1"
              >
                Keep playing
              </Button>
              <Button
                onClick={onConfirm}
                className="justify-center sm:flex-1"
                variant="secondary"
              >
                {isRestart ? 'Restart game' : 'Quit to setup'}
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal.Panel>
    </Modal>
  );
}

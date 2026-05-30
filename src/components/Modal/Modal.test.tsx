import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';
import { ModalStackProvider } from './ModalStackContext';

function renderWithProvider(ui: ReactElement) {
  return render(<ModalStackProvider>{ui}</ModalStackProvider>);
}

describe('Modal (compound API)', () => {
  it('does not expose the dialog when closed', () => {
    renderWithProvider(
      <Modal
        isOpen={false}
        ariaLabel="My modal"
      >
        <Modal.Header>
          <Modal.Title>My modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    // Role-based queries should respect aria-hidden="true"
    const dialog = screen.queryByRole('dialog', { name: /my modal/i });
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders a dialog with correct accessible name from <Modal.Title>', () => {
    renderWithProvider(
      <Modal
        isOpen
        ariaLabel={undefined}
      >
        <Modal.Header>
          <Modal.Title>My modal title</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'My modal title' });
    expect(dialog).toBeInTheDocument();
  });

  it('falls back to ariaLabel when no <Modal.Title> is used', () => {
    renderWithProvider(
      <Modal
        isOpen
        ariaLabel="Aria label only"
      >
        <Modal.Header>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Aria label only' });
    expect(dialog).toBeInTheDocument();
  });

  it('warns in development when an open modal has no accessible name', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProvider(
      <Modal isOpen>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Modal requires an accessible name. Add <Modal.Title> or pass ariaLabel.'
    );

    errorSpy.mockRestore();
  });

  it('does not warn when an open modal is named by its title', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProvider(
      <Modal isOpen>
        <Modal.Header>
          <Modal.Title>My modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        onClose={onClose}
        ariaLabel="My modal"
      >
        <Modal.Header>
          <Modal.Title>My modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'My modal' });

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking on the overlay, but not when clicking inside the dialog', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        onClose={onClose}
        ariaLabel="My modal"
      >
        <Modal.Header>
          <Modal.Title>My modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'My modal' });
    const overlay = document.querySelector('.modal__overlay');
    expect(overlay).not.toBeNull();

    // Click inside the dialog: SHOULD NOT close
    await user.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    // Click on the overlay background: SHOULD close
    await user.click(overlay as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus into the dialog on open and restores it to the trigger on close', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
          >
            Open modal
          </button>

          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            ariaLabel="My modal"
          >
            <Modal.Header>
              <Modal.Title>My modal</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body>
              <button>First focusable</button>
              <button>Second focusable</button>
            </Modal.Body>
          </Modal>
        </>
      );
    }

    renderWithProvider(<Harness />);

    const openButton = screen.getByRole('button', { name: /open modal/i });

    // Focus the trigger first
    openButton.focus();
    expect(openButton).toHaveFocus();

    // Open the modal
    await user.click(openButton);

    const firstFocusable = await screen.findByRole('button', {
      name: 'Close dialog',
    });
    expect(firstFocusable).toHaveFocus();

    // Press Escape to close
    await user.keyboard('{Escape}');
    expect(openButton).toHaveFocus();
  });

  it('focuses the dialog itself when no tabbable children exist', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
          >
            Open modal
          </button>

          <Modal
            isOpen={open}
            ariaLabel="Empty modal"
          >
            <Modal.Body>
              <p>No controls here</p>
            </Modal.Body>
          </Modal>
        </>
      );
    }

    renderWithProvider(<Harness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = screen.getByRole('dialog', { name: 'Empty modal' });
    expect(dialog).toHaveAttribute('tabindex', '-1');
    expect(dialog).toHaveFocus();
  });

  it('hides and inerts body siblings behind the modal portal', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <main data-testid="page-content">Page content</main>
          <button
            type="button"
            onClick={() => setOpen(true)}
          >
            Open modal
          </button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            ariaLabel="My modal"
          >
            <Modal.Body>
              <button>Inside</button>
            </Modal.Body>
          </Modal>
        </>
      );
    }

    renderWithProvider(<Harness />);

    const pageContent = screen.getByTestId('page-content');
    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const renderRoot = pageContent.closest('div');
    expect(renderRoot).toHaveAttribute('aria-hidden', 'true');
    expect(renderRoot).toHaveAttribute('inert');
    expect(document.body).toHaveClass('modal-open');

    await user.keyboard('{Escape}');

    expect(renderRoot).not.toHaveAttribute('aria-hidden');
    expect(renderRoot).not.toHaveAttribute('inert');
    expect(document.body).not.toHaveClass('modal-open');
  });

  it('Modal.CloseButton uses context to call close()', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        onClose={onClose}
        ariaLabel="My modal"
      >
        <Modal.Header>
          <Modal.Title>My modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <button>Inside</button>
        </Modal.Body>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: 'Close dialog' });

    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Modal.Panel, Header, and Content provide the standard composed modal structure', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        onClose={onClose}
      >
        <Modal.Panel size="narrow">
          <Modal.Header>
            <Modal.Title>Standard modal</Modal.Title>
            <Modal.CloseButton ariaLabel="Close standard modal" />
          </Modal.Header>
          <Modal.Content>
            <button>Inside frame</button>
          </Modal.Content>
        </Modal.Panel>
      </Modal>
    );

    expect(screen.getByRole('dialog', { name: 'Standard modal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inside frame' })).toBeInTheDocument();
    expect(document.querySelector('.modal-panel--narrow')).not.toBeNull();
    expect(document.querySelector('.modal-panel__header')).not.toBeNull();
    expect(document.querySelector('.modal-panel__content')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: 'Close standard modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

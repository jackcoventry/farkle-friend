import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SidebarModal } from './SidebarModal';

describe('SidebarModal', () => {
  it('renders dialog when open and calls onClose via close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <SidebarModal
        id="test-modal"
        isOpen
        onClose={onClose}
        ariaLabel="Game setup summary"
        closeLabel="Close setup summary"
      >
        <p>Body</p>
      </SidebarModal>
    );

    expect(screen.getByRole('dialog', { name: 'Game setup summary' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close setup summary' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render anything when closed', () => {
    render(
      <SidebarModal
        id="test-modal"
        isOpen={false}
        onClose={() => {}}
        ariaLabel="Game setup summary"
        closeLabel="Close setup summary"
      >
        <p>Body</p>
      </SidebarModal>
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('Body')).toBeNull();
  });
});

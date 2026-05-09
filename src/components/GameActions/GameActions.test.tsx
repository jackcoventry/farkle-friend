import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameActions } from './GameActions';

describe('GameActions', () => {
  it('calls onRestart and onQuit', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    const onQuit = vi.fn();

    render(
      <GameActions
        onRestart={onRestart}
        onQuit={onQuit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Restart game' }));
    expect(onRestart).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Quit to setup' }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });
});

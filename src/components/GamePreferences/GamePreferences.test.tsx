import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { GamePreferences } from './GamePreferences';

describe('GamePreferences', () => {
  it('opens a preferences modal and updates a preference', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GamePreferences />);

    await user.click(screen.getByRole('button', { name: 'Preferences' }));
    const dialog = screen.getByRole('dialog', { name: 'Game preferences' });
    expect(dialog).toBeInTheDocument();

    // Sound preference: default initial state is true in game logic; toggle to Off.
    const off = screen.getByLabelText('Off', { selector: '#preferenceSound_off' });
    await user.click(off);
    expect(off).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Close preferences' }));
    expect(screen.queryByRole('dialog', { name: 'Game preferences' })).toBeNull();
  });
});

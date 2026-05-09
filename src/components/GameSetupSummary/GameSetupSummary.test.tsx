import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { GamePreferences, GameSettings } from '@/domain/game/gameTypes';
import { GameSetupSummary } from './GameSetupSummary';

describe('GameSetupSummary', () => {
  it('renders settings and preferences summary', () => {
    const preferences: GamePreferences = {
      locale: 'en',
      motionEnabled: true,
      tableFeedback: false,
      theme: 'dark',
    };
    const settings: GameSettings = {
      autoAdvanceTurns: true,
      mode: 'dice',
      showComboSuggestions: false,
      targetScore: 5000,
    };

    render(
      <GameSetupSummary
        preferences={preferences}
        settings={settings}
      />
    );

    expect(screen.getByRole('heading', { name: 'Game setup' })).toBeInTheDocument();
    expect(screen.getByText('Dice rolling')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Combo hints').closest('div')).toHaveTextContent('Off');
    expect(screen.getByText('Feedback').closest('div')).toHaveTextContent('Off');
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('shows an edit settings button when handler provided', async () => {
    const user = userEvent.setup();
    const onEditSettings = vi.fn();

    const preferences: GamePreferences = {
      locale: 'en',
      motionEnabled: true,
      tableFeedback: true,
      theme: 'system',
    };
    const settings: GameSettings = {
      autoAdvanceTurns: false,
      mode: 'manual',
      showComboSuggestions: true,
      targetScore: 500,
    };

    render(
      <GameSetupSummary
        onEditSettings={onEditSettings}
        preferences={preferences}
        settings={settings}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit settings' }));
    expect(onEditSettings).toHaveBeenCalledTimes(1);
  });
});

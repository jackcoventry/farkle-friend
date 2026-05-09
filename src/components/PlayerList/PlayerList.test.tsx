import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Player } from '@/domain/game/gameTypes';
import PlayerList from './PlayerList';

function makePlayer(partial: Partial<Player>): Player {
  return {
    id: partial.id ?? 'p1',
    username: partial.username ?? 'Ada',
    avatar: partial.avatar ?? 1,
    totalScore: partial.totalScore ?? 0,
  } as Player;
}

describe('PlayerList', () => {
  it('renders players and highlights the active player', () => {
    const players = [makePlayer({ id: 'a', username: 'Ada', totalScore: 100 })];
    render(
      <PlayerList
        players={players}
        activePlayerId="a"
      />
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
    const item = screen.getByText('Ada').closest('li');
    expect(item).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('100 points')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('renders progress meter when targetScore is provided', () => {
    const players = [makePlayer({ id: 'a', username: 'Ada', totalScore: 50 })];
    render(
      <PlayerList
        players={players}
        targetScore={100}
      />
    );

    const meter = screen.getByRole('meter', {
      name: 'Ada is 50% of the way to the target score',
    });
    expect(meter).toHaveAttribute('aria-valuenow', '50');
  });

  it('calls onRemovePlayer when remove button clicked', async () => {
    const user = userEvent.setup();
    const onRemovePlayer = vi.fn();
    const players = [makePlayer({ id: 'a', username: 'Ada' })];

    render(
      <PlayerList
        players={players}
        onRemovePlayer={onRemovePlayer}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Remove Ada' }));
    expect(onRemovePlayer).toHaveBeenCalledWith('a');
  });
});

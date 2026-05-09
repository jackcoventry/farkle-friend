import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Player, Turn } from '@/domain/game/gameTypes';
import { GameFinishedModal } from './GameFinishedModal';

vi.mock('@/domain/game/gameAudio', () => ({
  playGameSound: vi.fn(),
}));

function makePlayer(partial: Partial<Player>): Player {
  return {
    id: partial.id ?? 'p1',
    username: partial.username ?? 'Ada',
    avatar: partial.avatar ?? 1,
    totalScore: partial.totalScore ?? 0,
  } as Player;
}

function makeTurn(partial: Partial<Turn>): Turn {
  return {
    id: partial.id ?? 't1',
    playerId: partial.playerId ?? 'p1',
    score: partial.score ?? 100,
    createdAt: partial.createdAt ?? Date.now(),
  } as Turn;
}

describe('GameFinishedModal', () => {
  it('renders winner summary and calls reset actions', async () => {
    const user = userEvent.setup();
    const onResetGame = vi.fn();
    const onResetPlayers = vi.fn();

    const winner = makePlayer({ id: 'p1', username: 'Ada', totalScore: 500 });
    const runnerUp = makePlayer({ id: 'p2', username: 'Grace', totalScore: 450 });
    const players = [runnerUp, winner];
    const turns = [
      makeTurn({ id: 't1', playerId: 'p2', score: 150 }),
      makeTurn({ id: 't2', playerId: 'p1', score: 0 }),
      makeTurn({ id: 't3', playerId: 'p1', score: 200 }),
    ];

    render(
      <GameFinishedModal
        onResetGame={onResetGame}
        onResetPlayers={onResetPlayers}
        players={players}
        soundEnabled={true}
        turns={turns}
        winner={winner}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Game finished' })).toBeInTheDocument();
    expect(screen.getByText('Ada wins!')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Final standings' })).toBeInTheDocument();
    expect(screen.getByText(/1\. Ada/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Grace/)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Game recap' })).toBeInTheDocument();
    expect(screen.getByText('Turns played')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Another game?' }));
    expect(onResetGame).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'New players' }));
    expect(onResetPlayers).toHaveBeenCalledTimes(1);
  });
});

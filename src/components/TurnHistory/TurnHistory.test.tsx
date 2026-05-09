import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Player, Turn } from '@/domain/game/gameTypes';
import { TurnHistory } from './TurnHistory';

function makePlayer(id: string, username: string, totalScore = 0): Player {
  return {
    id,
    username,
    avatar: 1,
    totalScore,
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

describe('TurnHistory', () => {
  it('returns null when there are no recent turns and no leader', () => {
    const { container } = render(
      <TurnHistory
        players={[makePlayer('p1', 'Ada')]}
        targetScore={1000}
        turns={[]}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows leader and needs summary when leader exists', () => {
    render(
      <TurnHistory
        leadingPlayerId="p1"
        players={[makePlayer('p1', 'Ada', 900)]}
        targetScore={1000}
        turns={[]}
      />
    );

    expect(screen.getByText('Leader')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Needs')).toBeInTheDocument();
  });

  it('renders recent events including farkle', () => {
    const players = [makePlayer('p1', 'Ada'), makePlayer('p2', 'Grace')];
    const turns = [
      makeTurn({ id: 't1', playerId: 'p1', score: 0 }),
      makeTurn({ id: 't2', playerId: 'p2', score: 150 }),
    ];

    render(
      <TurnHistory
        players={players}
        targetScore={1000}
        turns={turns}
      />
    );

    expect(screen.getByText('Recent events')).toBeInTheDocument();
    expect(screen.getByText(/Ada farkled/)).toBeInTheDocument();
    expect(screen.getByText('Farkle')).toBeInTheDocument();
    expect(screen.getByText(/Grace banked/)).toBeInTheDocument();
    expect(screen.getByText('+150')).toBeInTheDocument();
  });
});

import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Player, TurnResult } from '@/domain/game/gameTypes';
import { TurnResultPanel } from './TurnResultPanel';

function makePlayer(partial: Partial<Player>): Player {
  return {
    id: partial.id ?? 'p1',
    username: partial.username ?? 'Ada',
    avatar: partial.avatar ?? 1,
    totalScore: partial.totalScore ?? 0,
  } as Player;
}

function makeResult(partial: Partial<TurnResult>): TurnResult {
  return {
    playerId: partial.playerId ?? 'p1',
    score: partial.score ?? 100,
    previousTotal: partial.previousTotal ?? 0,
    newTotal: partial.newTotal ?? 100,
    isGameWinner: partial.isGameWinner ?? false,
  } as TurnResult;
}

describe('TurnResultPanel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders score summary and next-up copy', () => {
    renderWithProviders(
      <TurnResultPanel
        currentPlayer={makePlayer({ username: 'Ada' })}
        nextPlayer={makePlayer({ id: 'p2', username: 'Grace' })}
        onAdvanceTurn={() => {}}
        result={makeResult({ score: 50, previousTotal: 100, newTotal: 150 })}
      />
    );

    expect(screen.getByText('Turn score')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Previous total')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('New total')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Turn complete')).toBeInTheDocument();
    expect(screen.getByText('Grace is up next!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start turn' })).toBeInTheDocument();
  });

  it('calls onAdvanceTurn when the action button is clicked', async () => {
    const user = userEvent.setup();
    const onAdvanceTurn = vi.fn();

    renderWithProviders(
      <TurnResultPanel
        currentPlayer={makePlayer({})}
        nextPlayer={makePlayer({ id: 'p2', username: 'Grace' })}
        onAdvanceTurn={onAdvanceTurn}
        result={makeResult({})}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Start turn' }));
    expect(onAdvanceTurn).toHaveBeenCalledTimes(1);
  });

  it('auto-advances after 3 seconds when enabled', async () => {
    const onAdvanceTurn = vi.fn();
    vi.useFakeTimers();

    renderWithProviders(
      <TurnResultPanel
        autoAdvance
        currentPlayer={makePlayer({})}
        nextPlayer={makePlayer({ id: 'p2', username: 'Grace' })}
        onAdvanceTurn={onAdvanceTurn}
        result={makeResult({})}
      />
    );

    expect(screen.getByText(/Advancing automatically in/)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(onAdvanceTurn).toHaveBeenCalledTimes(1);
  });

  it('does not auto-advance when player is winner', async () => {
    const onAdvanceTurn = vi.fn();
    vi.useFakeTimers();

    renderWithProviders(
      <TurnResultPanel
        autoAdvance
        currentPlayer={makePlayer({ username: 'Ada' })}
        onAdvanceTurn={onAdvanceTurn}
        result={makeResult({ isGameWinner: true })}
      />
    );

    expect(screen.queryByText(/Advancing automatically in/)).toBeNull();
    await vi.advanceTimersByTimeAsync(5000);
    expect(onAdvanceTurn).not.toHaveBeenCalled();

    expect(screen.getByRole('button', { name: 'Show winner' })).toBeInTheDocument();
    expect(screen.getByText('Ada reached the target score.')).toBeInTheDocument();
  });

  it('advances turn on Enter when the panel itself is focused', async () => {
    const user = userEvent.setup();
    const onAdvanceTurn = vi.fn();

    // renderWithProviders wraps with providers; we still need a reliable focus target
    renderWithProviders(
      <TurnResultPanel
        currentPlayer={makePlayer({})}
        nextPlayer={makePlayer({ id: 'p2', username: 'Grace' })}
        onAdvanceTurn={onAdvanceTurn}
        result={makeResult({})}
      />
    );

    // Panel is a <section> with tabIndex=-1; find by its role via aria-live wrapper
    const panel = screen.getByText('Turn complete').closest('section');
    expect(panel).not.toBeNull();
    panel?.focus();

    await user.keyboard('{Enter}');
    expect(onAdvanceTurn).toHaveBeenCalledTimes(1);
  });
});

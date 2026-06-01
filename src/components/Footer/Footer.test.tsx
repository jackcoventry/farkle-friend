import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

const dynamicState = vi.hoisted(() => ({
  mode: 'loaded' as 'loaded' | 'loading',
}));

vi.mock('next/dynamic', () => ({
  default: (_loader: unknown, options?: { loading?: () => ReactNode }) => {
    return function DynamicStub() {
      if (dynamicState.mode === 'loading') {
        return options?.loading?.();
      }

      return <div>Rules stub</div>;
    };
  },
}));

vi.mock('@/components/GamePreferences/GamePreferences', () => ({
  GamePreferences: () => <div>Preferences stub</div>,
}));

describe('Footer', () => {
  beforeEach(() => {
    dynamicState.mode = 'loaded';
  });

  it('renders child actions, preferences, and attribution link', () => {
    render(
      <Footer>
        <button type="button">Custom footer action</button>
      </Footer>
    );

    expect(screen.getByRole('button', { name: 'Custom footer action' })).toBeInTheDocument();
    expect(screen.getByText('Preferences stub')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Built by Jack Coventry' });
    expect(link).toHaveAttribute('href', 'https://jrc.codes');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens and closes the loaded rules modal', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole('button', { name: 'View rules and scoring' }));
    expect(screen.getByRole('dialog', { name: 'Game rules and scoring' })).toBeInTheDocument();
    expect(screen.getByText('Rules & scoring')).toBeInTheDocument();
    expect(screen.getByText('Rules stub')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close rules and scoring' }));
    expect(screen.queryByRole('dialog', { name: 'Game rules and scoring' })).toBeNull();
  });

  it('shows the rules loading fallback while dynamic rules content is loading', async () => {
    dynamicState.mode = 'loading';
    const user = userEvent.setup();

    render(<Footer />);

    await user.click(screen.getByRole('button', { name: 'View rules and scoring' }));
    expect(screen.getByText('Loading rules...')).toBeInTheDocument();
    expect(screen.queryByText('Rules stub')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Footer from './Footer';

vi.mock('next/dynamic', () => ({
  default: () => {
    return function DynamicStub() {
      return <div>Rules stub</div>;
    };
  },
}));

vi.mock('@/components/GamePreferences/GamePreferences', () => ({
  GamePreferences: () => <div>Preferences stub</div>,
}));

describe('Footer', () => {
  it('renders attribution link and opens/closes rules modal', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    const link = screen.getByRole('link', { name: 'Built by Jack Coventry' });
    expect(link).toHaveAttribute('href', 'https://jrc.codes');
    expect(link).toHaveAttribute('target', '_blank');

    await user.click(screen.getByRole('button', { name: 'View rules and scoring' }));
    expect(screen.getByRole('dialog', { name: 'Game rules and scoring' })).toBeInTheDocument();
    expect(screen.getByText('Rules & scoring')).toBeInTheDocument();
    expect(screen.getByText('Rules stub')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close rules and scoring' }));
    expect(screen.queryByRole('dialog', { name: 'Game rules and scoring' })).toBeNull();
  });
});

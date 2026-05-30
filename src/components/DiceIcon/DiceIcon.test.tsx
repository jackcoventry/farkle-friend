import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiceIcon } from '@/components/DiceIcon/DiceIcon';

describe('DiceIcon', () => {
  it('renders role img with accessible label', () => {
    render(<DiceIcon count={6} />);
    expect(screen.getByRole('img', { name: 'A dice with 6 spots' })).toBeInTheDocument();
  });

  it('renders the correct number of dots', () => {
    const { container } = render(<DiceIcon count={3} />);
    expect(container.querySelectorAll('.dice-dot').length).toBe(3);
  });

  it('sets data attributes for count and state', () => {
    const { container } = render(
      <DiceIcon
        count={2}
        state="active"
      />
    );
    const root = container.querySelector('[role="img"]');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('data-count', '2');
    expect(root).toHaveAttribute('data-state', 'active');
  });
});

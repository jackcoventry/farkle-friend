import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ScoreGenerator from './ScoreGenerator';

describe('ScoreGenerator', () => {
  it('builds a round total from multiple scoring goes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = renderWithProviders(<ScoreGenerator onChange={onChange} />);

    const one = screen.getByRole('button', { name: 'Add die showing 1' });
    await user.click(one);
    await user.click(one);
    await user.click(one);
    await user.click(screen.getByRole('button', { name: 'Add go' }));

    await user.click(screen.getByRole('button', { name: 'Add die showing 5' }));
    await user.click(screen.getByRole('button', { name: 'Add go' }));

    expect(screen.getByText('Go 1')).toBeInTheDocument();
    expect(screen.getByText('Go 2')).toBeInTheDocument();
    expect(screen.getByText('1050')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(1050);

    rerender(
      <ScoreGenerator
        onChange={onChange}
        resetKey={1}
      />
    );

    expect(screen.queryByText('Go 1')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('does not add a go when the selected dice do not fully score', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(<ScoreGenerator onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Add die showing 2' }));

    expect(screen.getByRole('button', { name: 'Add go' })).toBeDisabled();
    expect(screen.getByText(/Only add dice/)).toBeInTheDocument();
  });
});

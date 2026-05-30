import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pill } from './Pill';

describe('Pill', () => {
  it('keeps a native radio input accessible through the visible label', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Pill>
        <Pill.Control>
          <input
            id="pill-radio"
            name="pill-choice"
            type="radio"
            onChange={handleChange}
          />
        </Pill.Control>
        <Pill.Label htmlFor="pill-radio">Auto</Pill.Label>
      </Pill>
    );

    const radio = screen.getByRole('radio', { name: 'Auto' });

    expect(radio).not.toBeChecked();

    await user.click(screen.getByText('Auto'));

    expect(radio).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders the visible pill block immediately after the input', () => {
    render(
      <Pill>
        <Pill.Control>
          <input
            id="pill-adjacent"
            name="pill-adjacent"
            type="radio"
          />
        </Pill.Control>
        <Pill.Label htmlFor="pill-adjacent">Manual</Pill.Label>
      </Pill>
    );

    const radio = screen.getByRole('radio', { name: 'Manual' });

    expect(radio).toHaveClass('pill-input');
    expect(radio.nextElementSibling).toHaveClass('pill-box');
  });

  it('supports checkbox controls without changing their native behavior', async () => {
    const user = userEvent.setup();

    render(
      <Pill>
        <Pill.Control>
          <input
            id="pill-checkbox"
            type="checkbox"
          />
        </Pill.Control>
        <Pill.Label htmlFor="pill-checkbox">Enable sounds</Pill.Label>
      </Pill>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Enable sounds' });

    await user.click(screen.getByText('Enable sounds'));
    expect(checkbox).toBeChecked();

    await user.click(screen.getByText('Enable sounds'));
    expect(checkbox).not.toBeChecked();
  });

  it('preserves disabled input semantics', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Pill>
        <Pill.Control>
          <input
            disabled
            id="pill-disabled"
            type="checkbox"
            onChange={handleChange}
          />
        </Pill.Control>
        <Pill.Label htmlFor="pill-disabled">Unavailable</Pill.Label>
      </Pill>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Unavailable' });

    expect(checkbox).toBeDisabled();

    await user.click(screen.getByText('Unavailable'));

    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });
});

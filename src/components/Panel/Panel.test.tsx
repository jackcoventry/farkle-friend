import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders a section with children', () => {
    render(
      <Panel>
        <h2>Title</h2>
      </Panel>
    );

    const title = screen.getByRole('heading', { name: 'Title' });
    expect(title).toBeInTheDocument();
    expect(title.closest('section')).not.toBeNull();
  });

  it('forwards props to the section element', () => {
    render(
      <Panel
        aria-label="My panel"
        className="custom"
      >
        content
      </Panel>
    );

    const panel = screen.getByLabelText('My panel');
    expect(panel.tagName.toLowerCase()).toBe('section');
    expect(panel.className).toContain('custom');
  });
});

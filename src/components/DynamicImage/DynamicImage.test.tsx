import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DynamicImage } from './DynamicImage';

// next/image doesn't behave like a normal img in jsdom; mock it to a plain img for unit tests.
vi.mock('next/image', () => ({
  default: (props: never) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('DynamicImage', () => {
  it('renders an image with default alt fallback to name', () => {
    render(<DynamicImage name="dice" />);
    expect(screen.getByRole('img', { name: 'dice' })).toBeInTheDocument();
  });

  it('respects provided alt text', () => {
    render(
      <DynamicImage
        name="rocket"
        alt="Rocket icon"
      />
    );
    expect(screen.getByRole('img', { name: 'Rocket icon' })).toBeInTheDocument();
  });
});

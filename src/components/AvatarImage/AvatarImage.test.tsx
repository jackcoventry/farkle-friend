import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Avatar } from '@/domain/game/avatars';
import { AvatarImage } from './AvatarImage';

describe('AvatarImage', () => {
  it('renders an img with alt text and src', () => {
    const avatar: Avatar = {
      id: 1,
      name: 'Hotdog',
      color: 'bg-red-500',
      image: '/avatar/food/hotdog.svg',
    };

    render(
      <AvatarImage
        avatar={avatar}
        alt="Player avatar"
        className="w-10"
      />
    );

    const img = screen.getByRole('img', { name: 'Player avatar' });
    expect(img).toHaveAttribute('src', '/avatar/food/hotdog.svg');
    expect(img.className).toContain('w-10');
  });
});

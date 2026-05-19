import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { avatarSet } from '@/domain/game/avatars';
import { AvatarImage } from './AvatarImage';

describe('AvatarImage', () => {
  it('renders an img with alt text and src', () => {
    const avatar = avatarSet[2];

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

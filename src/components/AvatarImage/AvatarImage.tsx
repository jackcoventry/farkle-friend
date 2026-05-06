/* eslint-disable @next/next/no-img-element */
import type { Avatar } from '@/domain/game/avatars';

type AvatarImageProps = {
  alt: string;
  avatar: Avatar;
  className?: string;
};

export function AvatarImage({ alt, avatar, className }: Readonly<AvatarImageProps>) {
  // SVG avatars are local static assets; plain img avoids Next image aspect-ratio warnings.
  return (
    <img
      alt={alt}
      className={className}
      src={avatar.image}
    />
  );
}

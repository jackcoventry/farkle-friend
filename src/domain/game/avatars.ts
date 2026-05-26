export const avatarValues = [1, 2, 3, 4, 5, 6] as const;

type AvatarInfo = {
  name: string;
  swatchClassName: string;
  image: string;
};

export const avatarSet = {
  1: {
    name: 'Burger',
    swatchClassName: 'avatar-swatch--burger',
    image: '/avatar/food/burger.svg',
  },
  2: {
    name: 'Hot dog',
    swatchClassName: 'avatar-swatch--hotdog',
    image: '/avatar/food/hotdog.svg',
  },
  3: {
    name: 'Noodles',
    swatchClassName: 'avatar-swatch--noodles',
    image: '/avatar/food/noodles.svg',
  },
  4: {
    name: 'Pie',
    swatchClassName: 'avatar-swatch--pie',
    image: '/avatar/food/pie.svg',
  },
  5: {
    name: 'Sandwich',
    swatchClassName: 'avatar-swatch--sandwich',
    image: '/avatar/food/sandwich.svg',
  },
  6: {
    name: 'Soup',
    swatchClassName: 'avatar-swatch--soup',
    image: '/avatar/food/soup.svg',
  },
} as const satisfies Record<number, AvatarInfo>;

export type AvatarSet = typeof avatarSet;
export type AvatarId = keyof typeof avatarSet & number;
export type Avatar = AvatarSet[AvatarId];

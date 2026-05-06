export const avatarValues = [1, 2, 3, 4, 5, 6] as const;

type AvatarInfo = {
  name: string;
  color: string;
  image: string;
};

export const avatarSet = {
  1: { name: "Burger", color: "bg-red-500", image: "/avatar/food/burger.svg" },
  2: {
    name: "Hot dog",
    color: "bg-blue-500",
    image: "/avatar/food/hotdog.svg",
  },
  3: {
    name: "Noodles",
    color: "bg-green-500",
    image: "/avatar/food/noodles.svg",
  },
  4: { name: "Pie", color: "bg-orange-500", image: "/avatar/food/pie.svg" },
  5: {
    name: "Sandwich",
    color: "bg-yellow-500",
    image: "/avatar/food/sandwich.svg",
  },
  6: { name: "Soup", color: "bg-purple-500", image: "/avatar/food/soup.svg" },
} as const satisfies Record<number, AvatarInfo>;

export type AvatarSet = typeof avatarSet;
export type AvatarId = keyof typeof avatarSet & number;
export type Avatar = AvatarSet[AvatarId];

export type Player = {
  id: string;
  name: string;
};

export type GameState = {
  id: string;
  players: Player[];
  createdAt: string;
  updatedAt: string;
};

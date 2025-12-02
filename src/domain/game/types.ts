export type GameId = string;

export type Player = {
  id: string;
  username: string;
};

export type GameState = {
  id: string;
  players: Player[];
  createdAt: string;
  updatedAt: string;
};

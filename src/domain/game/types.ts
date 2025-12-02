export type GamePhase = "LOBBY" | "IN_PROGRESS" | "FINISHED";
export type GameId = string;
export type Player = {
  id: string;
  username: string;
};

export type GameState = {
  id: GameId;
  phase: GamePhase;
  players: Player[];
  createdAt: string;
  updatedAt: string;
};

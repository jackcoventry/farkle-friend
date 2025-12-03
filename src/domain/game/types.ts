export type GamePhase = "LOBBY" | "IN_PROGRESS" | "FINISHED";
export type PlayerId = string;
export type GameId = string;
export type Player = {
  id: PlayerId;
  username: string;
};

export type GameState = {
  id: GameId;
  phase: GamePhase;
  players: Player[];
  turns: Turn[];
  currentPlayerIndex: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Turn = {
  id: string;
  gameId: GameId;
  playerId: PlayerId;
  score: number;
  turnIndex: number;
  createdAt: string;
};

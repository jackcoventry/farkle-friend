export type GamePhase = "LOBBY" | "IN_PROGRESS" | "FINISHED";

export type PlayerId = string;

export type GameId = string;

export type Player = {
  id: PlayerId;
  username: string;
  avatar: number;
};

export type GameState = {
  id: GameId;
  createdAt: string;
  currentPlayerIndex: number | null;
  phase: GamePhase;
  players: Player[];
  turns: Turn[];
  updatedAt: string;
};

export type Turn = {
  id: string;
  createdAt: string;
  gameId: GameId;
  playerId: PlayerId;
  score: number;
  turnIndex: number;
};

export type PlayerScoreSummary = {
  playerId: PlayerId;
  totalScore: number;
  username: string;
  avatar: number;
};

export type GameSummary = {
  isTargetReached: boolean;
  leadingPlayerId: PlayerId | null;
  players: PlayerScoreSummary[];
  winnerId: PlayerId | null;
};

import { GameId, GameState } from "./types";

export function createInitialGameState(): GameState {
  const now = new Date().toISOString();
  const gameId: GameId = "1";

  return {
    id: gameId,
    players: [],
    createdAt: now,
    updatedAt: now,
  };
}

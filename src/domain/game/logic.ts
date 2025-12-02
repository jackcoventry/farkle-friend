import { generateId } from "@/utils/generateId";
import { GameId, GameState, Player } from "./types";

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

// Helper function to keep the updatedAt up-to-date
function withUpdatedAt<T extends { updatedAt: string }>(state: T): T {
  return { ...state, updatedAt: new Date().toISOString() };
}

// Helper for the add player reducer action
export function addPlayer(state: GameState, username: string): GameState {
  const id = generateId();
  const trimmed = username.trim();
  if (!trimmed) return state;

  const newPlayer: Player = {
    id,
    username: trimmed,
  };

  return withUpdatedAt({
    ...state,
    players: [...state.players, newPlayer],
  });
}

import {
  addPlayer,
  endGame,
  recordTurn,
  resetGame,
  startGame,
} from "./gameLogic";
import { GameState, PlayerId } from "./gameTypes";

export type GameAction =
  | { type: "ADD_PLAYER"; username: string; avatar: number }
  | { type: "START_GAME" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "RECORD_TURN"; playerId: PlayerId; score: number };

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      return addPlayer(state, action.username, action.avatar);
    case "START_GAME":
      return startGame(state);
    case "END_GAME":
      return endGame(state);
    case "RESET_GAME":
      return resetGame(state);
    case "RECORD_TURN":
      return recordTurn(state, action.playerId, action.score);
    default:
      return state;
  }
}

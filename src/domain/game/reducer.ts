import { addPlayer, endGame, startGame } from "./logic";
import { GameState } from "./types";

export type GameAction =
  | { type: "ADD_PLAYER"; username: string }
  | { type: "START_GAME" }
  | { type: "END_GAME" };

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      return addPlayer(state, action.username);
    case "START_GAME":
      return startGame(state);
    case "END_GAME":
      return endGame(state);
    default:
      return state;
  }
}

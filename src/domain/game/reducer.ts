import { addPlayer } from "./logic";
import { GameState } from "./types";

export type GameAction = { type: "ADD_PLAYER"; username: string };

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      return addPlayer(state, action.username);
    default:
      return state;
  }
}

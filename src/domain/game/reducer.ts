import { GameState } from "./types";

export type GameAction = { type: "ADD_PLAYER"; name: string };

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_PLAYER":
      console.log("added player!", action, state);
      return state;
    default:
      return state;
  }
}

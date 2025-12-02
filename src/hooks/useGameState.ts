"use client";

import { useReducer } from "react";
import type { GameState } from "@/domain/game/types";
import { createInitialGameState } from "@/domain/game/logic";
import { reducer } from "@/domain/game/reducer";

function createInitialState(): GameState {
  return createInitialGameState();
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  return { state, dispatch };
}

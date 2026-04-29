"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import type { GameState } from "@/domain/game/gameTypes";
import type { GameAction } from "@/domain/game/gameReducer";

type GameContextValue = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const value = useGameState();

  useEffect(() => {
    document.documentElement.dataset.motion = value.state.settings.motionEnabled
      ? "on"
      : "off";
  }, [value.state.settings.motionEnabled]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within <GameProvider />");
  return ctx;
}

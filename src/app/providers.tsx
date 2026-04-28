"use client";

import { ModalStackProvider } from "@/components/Modal/ModalStackContext";
import { GameProvider } from "@/domain/game/GameProvider";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ModalStackProvider>
      <GameProvider>{children}</GameProvider>
    </ModalStackProvider>
  );
}

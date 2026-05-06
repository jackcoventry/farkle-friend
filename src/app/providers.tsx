'use client';

import { GameProvider } from '@/domain/game/GameProvider';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ModalStackProvider>
      <GameProvider>{children}</GameProvider>
    </ModalStackProvider>
  );
}

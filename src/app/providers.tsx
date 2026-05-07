'use client';

import { I18nProvider } from '@/i18n/I18nProvider';
import { GameProvider } from '@/domain/game/GameProvider';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ModalStackProvider>
      <GameProvider>
        <I18nProvider>{children}</I18nProvider>
      </GameProvider>
    </ModalStackProvider>
  );
}

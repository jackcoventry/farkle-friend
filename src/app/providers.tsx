'use client';

import { I18nProvider } from '@/i18n/I18nProvider';
import { ReactNode, useEffect } from 'react';
import { GameProvider } from '@/domain/game/GameProvider';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: Readonly<ProvidersProps>) {
  useEffect(() => {
    document.documentElement.dataset.appReady = 'true';
  }, []);

  return (
    <ModalStackProvider>
      <GameProvider>
        <I18nProvider>{children}</I18nProvider>
      </GameProvider>
    </ModalStackProvider>
  );
}

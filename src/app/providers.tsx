'use client';

import { I18nProvider } from '@/i18n/I18nProvider';
import { GameProvider } from '@/domain/game/GameProvider';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister/ServiceWorkerRegister';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <ModalStackProvider>
      <GameProvider>
        <I18nProvider>
          <ServiceWorkerRegister />
          {children}
        </I18nProvider>
      </GameProvider>
    </ModalStackProvider>
  );
}

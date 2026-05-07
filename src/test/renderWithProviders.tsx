import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { GameProvider } from '@/domain/game/GameProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';

function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ModalStackProvider>
      <GameProvider>
        <I18nProvider>{children}</I18nProvider>
      </GameProvider>
    </ModalStackProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: AppProviders,
    ...options,
  });
}

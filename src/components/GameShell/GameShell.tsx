'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { Children, ReactNode, isValidElement } from 'react';
import './GameShell.css';

type RootProps = {
  children: ReactNode;
};

type SlotProps = {
  children: ReactNode;
};

type SidebarProps = SlotProps & {
  isDesktop?: boolean;
};

export function GameShell({ children }: Readonly<RootProps>) {
  const { t } = useI18n();
  const extras: ReactNode[] = [];
  let sidebar, mobileToolbar, body;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === GameShell.Sidebar) {
      sidebar = child;
      return;
    }
    if (child.type === GameShell.MobileToolbar) {
      mobileToolbar = child;
      return;
    }
    if (child.type === GameShell.Body) {
      body = child;
      return;
    }

    extras.push(child);
  });

  return (
    <main className="game-shell | grid h-dvh min-h-dvh">
      <h1 className="sr-only">{t('game.title')}</h1>
      {sidebar}
      {extras}
      {body}
      {mobileToolbar}
    </main>
  );
}

GameShell.Sidebar = function Header({ children, isDesktop = false }: SidebarProps) {
  const { t } = useI18n();

  return (
    <aside
      className={`game-shell__sidebar | bg-surface p-md sm:p-lg max-h-dvh min-h-0 overflow-auto ${isDesktop ? 'hidden xl:flex xl:flex-col xl:justify-between' : ''}`}
      aria-label={t('actions.gameMenu')}
    >
      {children}
    </aside>
  );
};

GameShell.SidebarMain = function SidebarMain({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-main | gap-xl flex min-h-0 flex-col overflow-auto">
      {children}
    </div>
  );
};

GameShell.SidebarFooter = function SidebarFooter({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-footer | gap-md pt-md grid overflow-visible">
      {children}
    </div>
  );
};

GameShell.MobileToolbar = function MobileToolbar({ children }: SlotProps) {
  return (
    <nav className="game-shell__mobile-toolbar | bg-canvas p-xs flex justify-between xl:hidden">
      {children}
    </nav>
  );
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-canvas p-md lg:p-xl min-w-0 overflow-auto">
      {children}
    </section>
  );
};

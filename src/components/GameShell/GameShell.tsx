'use client';

import React from 'react';
import './GameShell.css';

type RootProps = {
  children: React.ReactNode;
};

type SlotProps = {
  children: React.ReactNode;
};

type SidebarProps = SlotProps & {
  isDesktop?: boolean;
};

export default function GameShell({ children }: Readonly<RootProps>) {
  const extras: React.ReactNode[] = [];
  let sidebar, mobileToolbar, body;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

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
      <h1 className="sr-only">Farkle Friend</h1>
      {sidebar}
      {extras}
      {body}
      {mobileToolbar}
    </main>
  );
}

GameShell.Sidebar = function Header({ children, isDesktop = false }: SidebarProps) {
  return (
    <aside
      className={`game-shell__sidebar | p-md lg:p-xl bg-surface grid max-h-dvh min-h-0 overflow-hidden ${isDesktop ? 'hidden xl:flex xl:flex-col xl:justify-between' : ''}`}
      aria-label="Game menu"
    >
      {children}
    </aside>
  );
};

GameShell.SidebarMain = function SidebarMain({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-main | gap-xl pr-2xs flex min-h-0 flex-col overflow-auto">
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
  return <nav className="bg-canvas p-xs flex justify-between xl:hidden">{children}</nav>;
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-canvas p-md lg:p-xl min-w-0 overflow-auto">
      {children}
    </section>
  );
};

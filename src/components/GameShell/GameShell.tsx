'use client';

import React from 'react';

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
    <main className="game-shell | h-dvh min-h-dvh grid grid-cols-1 grid-rows-[1fr_auto] xl:grid-cols-[400px_1fr] xl:grid-rows-1">
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
      className={`game-shell__sidebar | grid grid-rows-[minmax(0,1fr)_auto] max-h-dvh min-h-0 overflow-hidden p-4 lg:p-6 bg-surface ${isDesktop ? 'hidden xl:flex xl:flex-col xl:justify-between' : ''}`}
      aria-label="Game menu"
    >
      {children}
    </aside>
  );
};

GameShell.SidebarMain = function SidebarMain({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-main | pr-1 overflow-auto min-h-0 flex flex-col gap-6">
      {children}
    </div>
  );
};

GameShell.SidebarFooter = function SidebarFooter({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-footer | grid gap-4 overflow-visible pt-4">{children}</div>
  );
};

GameShell.MobileToolbar = function MobileToolbar({ children }: SlotProps) {
  return <nav className="bg-canvas xl:hidden p-2 flex justify-between">{children}</nav>;
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-canvas p-4 lg:p-6 min-w-0 overflow-auto">
      {children}
    </section>
  );
};

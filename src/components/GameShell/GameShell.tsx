"use client";

import React, { useEffect, useState } from "react";
import { GameScreenSidebar } from "../GameScreen/ActiveGameScreen";

const SIDEBAR_ID = "game-shell-sidebar";

type RootProps = {
  children: React.ReactNode;
};

type SlotProps = {
  children: React.ReactNode;
};

export default function GameShell({ children }: Readonly<RootProps>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let sidebar, mobileToolbar, body;

  useEffect(() => {
    if (!isSidebarOpen) return;

    document.getElementById(SIDEBAR_ID)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsSidebarOpen(false);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === GameShell.Sidebar || child.type === GameScreenSidebar)
      sidebar = child;
    if (child.type === GameShell.MobileToolbar) mobileToolbar = child;
    if (child.type === GameShell.Body) body = child;
  });

  return (
    <main
      className="game-shell | h-dvh min-h-dvh grid grid-cols-1 grid-rows-[1fr_auto] xl:grid-cols-[400px_1fr] xl:grid-rows-1"
      data-sidebar-open={isSidebarOpen ? "true" : "false"}
    >
      <h1 className="sr-only">Farkle Friend</h1>
      {sidebar}
      {body}
      {mobileToolbar}
    </main>
  );
}

GameShell.Sidebar = function Header({
  children,
  isDesktop = false,
}: SlotProps) {
  return (
    <aside
      id={SIDEBAR_ID}
      className={`game-shell__sidebar | grid grid-rows-[minmax(0,1fr)_auto] max-h-dvh min-h-0 overflow-hidden p-4 lg:p-6 bg-gray-800 ${isDesktop ? "hidden xl:flex xl:flex-col xl:justify-between" : ""}`}
      aria-label="Game menu"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {children}
    </aside>
  );
};

GameShell.SidebarMain = function SidebarMain({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-main | pr-1 overflow-auto min-h-0">
      {children}
    </div>
  );
};

GameShell.SidebarFooter = function SidebarFooter({ children }: SlotProps) {
  return (
    <div className="game-shell__sidebar-footer | grid gap-4 overflow-visible pt-4">
      {children}
    </div>
  );
};

GameShell.MobileToolbar = function MobileToolbar({ children }: SlotProps) {
  return (
    <nav className="bg-gray-900 xl:hidden p-2 flex justify-between">
      {children}
    </nav>
  );
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-gray-900 p-4 lg:p-6 min-w-0 overflow-auto">
      {children}
    </section>
  );
};

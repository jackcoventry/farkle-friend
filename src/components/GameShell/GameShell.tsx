"use client";

import React, { useEffect, useState } from "react";
import "./GameShell.css";

const SIDEBAR_ID = "game-shell-sidebar";

type RootProps = {
  children: React.ReactNode;
  sidebarCloseLabel?: string;
  sidebarOpenLabel?: string;
};

type SlotProps = {
  children: React.ReactNode;
};

export default function GameShell({
  children,
  sidebarCloseLabel = "Close sidebar",
  sidebarOpenLabel = "Open sidebar",
}: Readonly<RootProps>) {
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

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === GameShell.Sidebar) sidebar = child;
    if (child.type === GameShell.MobileToolbar) mobileToolbar = child;
    if (child.type === GameShell.Body) body = child;
  });

  return (
    <main
      className="game-shell | h-dvh"
      data-sidebar-open={isSidebarOpen ? "true" : "false"}
    >
      <h1 className="sr-only">Farkle Friend</h1>
      <div className="game-shell__mobile-toolbar">
        <button
          type="button"
          className="game-shell__toggle | rounded-lg bg-red-700 px-4 py-2 text-white"
          aria-controls={SIDEBAR_ID}
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          {isSidebarOpen ? sidebarCloseLabel : sidebarOpenLabel}
        </button>
        {mobileToolbar}
      </div>
      {isSidebarOpen ? (
        <button
          type="button"
          className="game-shell__backdrop"
          aria-label={sidebarCloseLabel}
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      {sidebar}
      {body}
    </main>
  );
}

GameShell.Sidebar = function Header({ children }: SlotProps) {
  return (
    <aside
      id={SIDEBAR_ID}
      className="game-shell__sidebar | p-6 bg-gray-800"
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
  return <div className="game-shell__sidebar-main">{children}</div>;
};

GameShell.SidebarFooter = function SidebarFooter({ children }: SlotProps) {
  return <div className="game-shell__sidebar-footer">{children}</div>;
};

GameShell.MobileToolbar = function MobileToolbar({ children }: SlotProps) {
  return <>{children}</>;
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-gray-900 p-6">{children}</section>
  );
};

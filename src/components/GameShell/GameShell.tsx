"use client";

import React, { useState } from "react";
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
  let sidebar, body;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === GameShell.Sidebar) sidebar = child;
    if (child.type === GameShell.Body) body = child;
  });

  return (
    <main
      className="game-shell | h-dvh"
      data-sidebar-open={isSidebarOpen ? "true" : "false"}
    >
      <h1 className="sr-only">Farkle Friend</h1>
      <button
        type="button"
        className="game-shell__toggle | rounded-lg bg-red-700 px-4 py-2 text-white"
        aria-controls={SIDEBAR_ID}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((current) => !current)}
      >
        {isSidebarOpen ? sidebarCloseLabel : sidebarOpenLabel}
      </button>
      {sidebar}
      {body}
    </main>
  );
}

GameShell.Sidebar = function Header({ children }: SlotProps) {
  return (
    <aside id={SIDEBAR_ID} className="game-shell__sidebar | p-6">
      {children}
    </aside>
  );
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-gray-800 p-6">{children}</section>
  );
};

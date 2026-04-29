import React from "react";
import "./GameShell.css";

type RootProps = {
  children: React.ReactNode;
};

type SlotProps = {
  children: React.ReactNode;
};

export default function GameShell({ children }: Readonly<RootProps>) {
  let sidebar, body;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === GameShell.Sidebar) sidebar = child;
    if (child.type === GameShell.Body) body = child;
  });

  return (
    <main className="game-shell | h-dvh">
      <h1 className="sr-only">Farkle Friend</h1>
      {sidebar}
      {body}
    </main>
  );
}

GameShell.Sidebar = function Header({ children }: SlotProps) {
  return <aside className="game-shell__sidebar | p-6">{children}</aside>;
};

GameShell.Body = function Body({ children }: SlotProps) {
  return (
    <section className="game-shell__body | bg-gray-800 p-6">{children}</section>
  );
};

import React, { ReactNode } from "react";

type NavItemProps = { children: ReactNode; className?: string };

export function NavItem({ children, className }: Readonly<NavItemProps>) {
  return <li className={className}>{children}</li>;
}

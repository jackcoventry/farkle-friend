import React, { ReactNode } from "react";
import { useNavRenderLink } from "@/components/Navigation/Navigation";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
};

export function NavLink({
  href,
  children,
  className,
  isActive,
}: Readonly<NavLinkProps>) {
  const renderLink = useNavRenderLink();
  const classes = ["nav-link", isActive ? "nav-link--active" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  const ariaCurrent = isActive ? "page" : undefined;

  if (renderLink) {
    return (
      <>{renderLink({ href, children, className: classes, ariaCurrent })}</>
    );
  }

  return (
    <a href={href} className={classes} aria-current={ariaCurrent}>
      {children}
    </a>
  );
}

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
  const classes = ["nav-link", className ?? ""].filter(Boolean).join(" ");

  if (renderLink) {
    return <>{renderLink({ href, children, className: classes })}</>;
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}

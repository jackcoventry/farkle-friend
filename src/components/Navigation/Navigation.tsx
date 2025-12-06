import React, { useState, ReactNode, useId } from "react";

export type NavLinkRenderProps = {
  ariaCurrent?: "page" | "step" | "location" | "date" | "time" | "true";
  children: ReactNode;
  className?: string;
  href: string;
};

export type RenderLink = (props: NavLinkRenderProps) => ReactNode;

type NavigationProps = {
  ariaLabel?: string;
  children: ReactNode;
  renderLink?: RenderLink;
};

const NavContext = React.createContext<RenderLink | undefined>(undefined);

export function useNavRenderLink(): RenderLink | undefined {
  return React.useContext(NavContext);
}

function Navigation({
  ariaLabel,
  children,
  renderLink,
}: Readonly<NavigationProps>) {
  const [open, setOpen] = useState<boolean>(false);
  const navId = useId();
  const menuId = `${navId}-menu`;

  const handleVisibility = () => {
    setOpen(!open);
  };

  return (
    <NavContext.Provider value={renderLink}>
      <header className="p-3 justify-center flex relative items-center">
        <span className="font-sub-heading">FARKLE FRIEND!</span>
        {children ? (
          <button
            aria-controls={menuId}
            aria-expanded={open}
            className="absolute right-0 h-full w-[100px] cursor-pointer"
            onClick={handleVisibility}
          >
            Menu
          </button>
        ) : null}
      </header>
      {open ? (
        <nav
          aria-label={ariaLabel}
          data-open={open ? "true" : "false"}
          id={menuId}
        >
          <ul>{children}</ul>
        </nav>
      ) : null}
    </NavContext.Provider>
  );
}

export default Navigation;

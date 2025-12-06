import React, { useState, ReactNode } from "react";

export type NavLinkRenderProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export type RenderLink = (props: NavLinkRenderProps) => ReactNode;

type NavigationProps = {
  children: ReactNode;
  renderLink?: RenderLink;
};

const NavContext = React.createContext<RenderLink | undefined>(undefined);

export function useNavRenderLink(): RenderLink | undefined {
  return React.useContext(NavContext);
}

function Navigation({ children, renderLink }: Readonly<NavigationProps>) {
  const [open, setOpen] = useState<boolean>(false);

  const handleVisibility = () => {
    setOpen(!open);
  };

  return (
    <NavContext.Provider value={renderLink}>
      <header className="p-3 justify-center flex relative items-center">
        <span className="font-sub-heading">FARKLE FRIEND!</span>
        {children ? (
          <button
            onClick={handleVisibility}
            className="absolute right-0 h-full w-[100px] cursor-pointer"
          >
            Menu
          </button>
        ) : null}
      </header>
      {open ? (
        <nav aria-label="Main Navigation">
          <ul>{children}</ul>
        </nav>
      ) : null}
    </NavContext.Provider>
  );
}

export default Navigation;

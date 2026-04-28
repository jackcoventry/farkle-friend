import React, { useState, ReactNode, useId, useRef, useCallback } from "react";

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

  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const handleVisibility = () => {
    setOpen(!open);
  };

  const getFocusableChain = useCallback((): HTMLElement[] => {
    const chain: HTMLElement[] = [];

    if (toggleRef.current) chain.push(toggleRef.current);

    if (navRef.current) {
      const selector = [
        "a[href]:not([tabindex='-1'])",
        "button:not([disabled]):not([tabindex='-1'])",
        "input:not([disabled]):not([tabindex='-1'])",
        "select:not([disabled]):not([tabindex='-1'])",
        "textarea:not([disabled]):not([tabindex='-1'])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");

      const nodes = Array.from(
        navRef.current.querySelectorAll<HTMLElement>(selector)
      );

      for (const el of nodes) {
        if (el !== toggleRef.current) chain.push(el);
      }
    }

    return chain;
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key, shiftKey } = event;

    if (!open) {
      if (key === "Escape" && document.activeElement === toggleRef.current) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (key === "Escape") {
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }

    if (key !== "Tab") return;

    const focusables = getFocusableChain();
    if (!focusables.length) return;

    const activeEl = document.activeElement as HTMLElement | null;
    const currentIndex = activeEl ? focusables.indexOf(activeEl) : -1;

    // If focus isn't currently inside the chain, let browser behavior stand.
    if (currentIndex === -1) return;

    // Focus trap:
    if (!shiftKey && currentIndex === focusables.length - 1) {
      event.preventDefault();
      focusables[0].focus();
    } else if (shiftKey && currentIndex === 0) {
      event.preventDefault();
      focusables?.at(-1)?.focus();
    }
  };

  return (
    <NavContext.Provider value={renderLink}>
      <header className="p-3 justify-center flex relative items-center">
        <span className="font-sub-heading">FARKLE FRIEND!</span>
        {children ? (
          <button
            aria-controls={menuId}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="absolute right-0 h-[50px] w-[50px] cursor-pointer z-50 items-center justify-center flex hover:bg-amber-200"
            onClick={handleVisibility}
            onKeyDown={handleKeyDown}
            ref={toggleRef}
            type="button"
          >
            <svg
              className="text-amber-900"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use
                xlinkHref={`/icons/icons.svg#${open ? "close" : "three-dots-vertical"}`}
              />
            </svg>
          </button>
        ) : null}
      </header>

      {open ? (
        <nav
          aria-label={ariaLabel}
          className="fixed w-[300px] top-0 right-0 bg-amber-100 h-full z-40 pt-[84px]"
          data-open={open ? "true" : "false"}
          id={menuId}
          onKeyDown={handleKeyDown}
          ref={navRef}
        >
          <ul>{children}</ul>
        </nav>
      ) : null}
    </NavContext.Provider>
  );
}

export default Navigation;

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ModalStackContextValue = {
  register: (id: string) => void;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
};

export const MODAL_PORTAL_ROOT_ID = 'modal-root';

const ModalStackContext = createContext<ModalStackContextValue | null>(null);

type ModalStackProviderProps = {
  children: ReactNode;
};

export function ModalStackProvider({ children }: Readonly<ModalStackProviderProps>) {
  const [stack, setStack] = useState<string[]>([]);
  const hiddenSiblingsRef = useRef<
    Array<{
      ariaHidden: string | null;
      element: HTMLElement;
      inert: boolean;
    }>
  >([]);

  const register = useCallback((id: string) => {
    setStack((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setStack((prev) => prev.filter((item) => item !== id));
  }, []);

  const isTop = useCallback(
    (id: string) => {
      if (stack.length === 0) return false;
      return stack[stack.length - 1] === id;
    },
    [stack]
  );

  useEffect(() => {
    const restoreHiddenSiblings = () => {
      for (const item of hiddenSiblingsRef.current) {
        if (item.ariaHidden == null) {
          item.element.removeAttribute('aria-hidden');
        } else {
          item.element.setAttribute('aria-hidden', item.ariaHidden);
        }

        item.element.inert = item.inert;
        if (!item.inert) {
          item.element.removeAttribute('inert');
        }
      }
      hiddenSiblingsRef.current = [];
    };

    restoreHiddenSiblings();

    if (stack.length === 0) {
      document.body.classList.remove('modal-open');
      return;
    }

    document.body.classList.add('modal-open');

    const portalRoot = document.getElementById(MODAL_PORTAL_ROOT_ID);
    if (!portalRoot) return;

    for (const element of Array.from(document.body.children)) {
      if (!(element instanceof HTMLElement)) continue;
      if (element === portalRoot) continue;

      hiddenSiblingsRef.current.push({
        ariaHidden: element.getAttribute('aria-hidden'),
        element,
        inert: element.inert,
      });
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('inert', '');
      element.inert = true;
    }

    return restoreHiddenSiblings;
  }, [stack.length]);

  const value = useMemo(
    () => ({
      register,
      unregister,
      isTop,
    }),
    [register, unregister, isTop]
  );

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>;
}

/**
 * Hook for a modal to participate in the global stack
 * - Registers/unregisters when active; i.e. when isOpen changes
 * - Returns whether this modal is currently the top-most one
 * - If no provider is present, falls back to a single modal
 */
export function useModalStack(id: string, active: boolean) {
  const ctx = useContext(ModalStackContext);

  const hasProvider = ctx !== null;
  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    if (!hasProvider || !active || !register || !unregister) return;

    register(id);
    return () => {
      unregister(id);
    };
  }, [active, hasProvider, id, register, unregister]);

  const isTopMost = ctx?.isTop ? ctx.isTop(id) : true;

  return { isTopMost };
}

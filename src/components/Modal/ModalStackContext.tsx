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

const ModalStackContext = createContext<ModalStackContextValue | null>(null);

type ModalStackProviderProps = {
  children: ReactNode;
};

export function ModalStackProvider({ children }: Readonly<ModalStackProviderProps>) {
  const [stack, setStack] = useState<string[]>([]);
  const prevOverflowRef = useRef<string>('');

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

  // Centralised scroll lock: lock when at least one modal is open
  useEffect(() => {
    if (stack.length === 0) {
      document.body.style.overflow = prevOverflowRef.current;
      return;
    }

    if (stack.length === 1) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
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

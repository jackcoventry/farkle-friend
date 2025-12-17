import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useModalStack } from "./ModalStackContext";
import Button from "@/components/Button/Button";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "details",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

type ModalVariant = "modal" | "splash";
type ThemeVariant = "default" | "warning" | "success";

type ModalContextValue = {
  titleId: string;
  close: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext(componentName: string): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used within <Modal>`);
  }
  return ctx;
}

type ModalRootProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  /**
   * Optional accessible name fallback when no <Modal.Title> is used.
   */
  ariaLabel?: string;
  id?: string;
  theme?: ThemeVariant;
  variant?: ModalVariant;
};

function ModalRoot({
  isOpen,
  onClose,
  children,
  ariaLabel,
  id,
  variant = "modal",
  theme = "default",
}: ModalRootProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const instanceId = useId();
  const titleId = useId();

  const { isTopMost } = useModalStack(instanceId, isOpen);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
  }, []);

  const focusFirstElement = useCallback(() => {
    const items = getFocusableElements();
    if (items.length > 0) {
      items[0].focus();
    } else {
      dialogRef.current?.focus();
    }
  }, [getFocusableElements]);

  // Move focus into the dialog when it opens and is top-most
  useEffect(() => {
    if (!isOpen || !isTopMost) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const raf = requestAnimationFrame(() => {
      focusFirstElement();
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, isTopMost, focusFirstElement]);

  // Restore focus when closed
  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || !isTopMost) return;

    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
      return;
    }

    if (e.key === "Tab") {
      const items = getFocusableElements();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const lastIndex = items.length - 1;
      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      } else {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      }

      e.preventDefault();
      items[nextIndex].focus();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen || !isTopMost) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  if (typeof document === "undefined") return null; // SSR / tests safety

  const close = () => onClose?.();
  const variantAttr = variant ?? "modal";
  const themeAttr = theme ?? "default";
  const contextValue: ModalContextValue = {
    titleId,
    close,
  };

  const ariaLabelledBy = ariaLabel ? undefined : titleId;
  const rootClasses = `modal | items-center justify-center bg-black/25 flex inset-0 fixed z-50${isOpen ? " opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"}`;
  const dialogClasses = `modal__dialog | flex flex-col outline-none w-full`;

  return createPortal(
    <div
      id={id}
      data-variant={variantAttr}
      data-theme={themeAttr}
      onClick={handleOverlayClick}
      role="none"
      className={rootClasses}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={isOpen ? undefined : true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={dialogClasses}
      >
        <ModalContext.Provider value={contextValue}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
}

type ModalSlot = {
  children: ReactNode;
  className?: string;
};

/**
 * <Modal.Header> — structural wrapper for the header area
 */
function ModalHeader({ children }: Readonly<ModalSlot>) {
  return <header>{children}</header>;
}

/**
 * <Modal.Title> — accessible title, wires up aria-labelledby via titleId
 */
function ModalTitle({ children }: Readonly<ModalSlot>) {
  const { titleId } = useModalContext("Modal.Title");
  return <h2 id={titleId}>{children}</h2>;
}

/**
 * <Modal.CloseButton> — standardised close button hooked into Modal.close()
 */
type ModalCloseButtonProps = {
  ariaLabel?: string;
  callback?: () => void;
};

function ModalCloseButton({
  ariaLabel = "Close dialog",
  callback,
}: Readonly<ModalCloseButtonProps>) {
  const { close } = useModalContext("Modal.CloseButton");
  const handleClose = () => {
    callback?.();
    close();
  };
  return (
    <Button
      type="button"
      onClick={handleClose}
      aria-label={ariaLabel}
      iconOnly
      icon="close"
      className="justify-end mb-4 ml-auto"
      variant="primary"
    />
  );
}

/**
 * <Modal.Body> — content area
 */
function ModalBody({ children, className }: Readonly<ModalSlot>) {
  return <div className={className}>{children}</div>;
}

/**
 * <Modal.Footer> — structural wrapper for the footer area
 */
function ModalFooter({ children }: Readonly<ModalSlot>) {
  return <footer>{children}</footer>;
}

/**
 * Compound export:
 *   <Modal.Root> with <Modal.Header>, <Modal.Title>, <Modal.CloseButton>, <Modal.Body>, <Modal.Footer>
 */
const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
export {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  ModalTitle,
};

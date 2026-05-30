import React, {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button/Button';
import './Modal.css';
import { MODAL_PORTAL_ROOT_ID, useModalStack } from './ModalStackContext';
import './SplashModal.css';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'details',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getModalPortalRoot() {
  let root = document.getElementById(MODAL_PORTAL_ROOT_ID);

  if (!root) {
    root = document.createElement('div');
    root.id = MODAL_PORTAL_ROOT_ID;
    document.body.appendChild(root);
  }

  return root;
}

function getAriaControlsTrigger(id: string | undefined) {
  if (!id) return null;

  return (
    Array.from(document.querySelectorAll<HTMLElement>('[aria-controls]')).find(
      (element) => element.getAttribute('aria-controls') === id
    ) ?? null
  );
}

type ModalVariant = 'modal' | 'splash';
type ThemeVariant = 'default' | 'warning' | 'success';

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
  returnFocusRef?: RefObject<HTMLElement | null>;
};

function ModalRoot({
  isOpen,
  onClose,
  children,
  ariaLabel,
  id,
  returnFocusRef,
  variant = 'modal',
  theme = 'default',
}: ModalRootProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const instanceId = useId();
  const titleId = useId();

  const { isTopMost } = useModalStack(instanceId, isOpen);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];
    return Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
    );
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
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      wasOpenRef.current = true;
    }

    if (isTopMost) {
      focusFirstElement();
    }
  }, [isOpen, isTopMost, focusFirstElement]);

  // Restore focus when closed
  useEffect(() => {
    if (isOpen || !lastFocusedRef.current) return;

    const fallbackElement = returnFocusRef?.current ?? getAriaControlsTrigger(id);
    const preferredElement =
      lastFocusedRef.current === document.body ? fallbackElement : lastFocusedRef.current;

    const restoreFocus = () => {
      const elementToRestore = preferredElement?.isConnected ? preferredElement : fallbackElement;
      elementToRestore?.focus({ preventScroll: true });
    };

    restoreFocus();
    const timeout = window.setTimeout(restoreFocus, 50);

    return () => window.clearTimeout(timeout);
  }, [id, isOpen, returnFocusRef]);

  useEffect(() => {
    if (!isOpen || ariaLabel || process.env.NODE_ENV === 'production') return;

    const titleElement = document.getElementById(titleId);
    if (titleElement) return;

    console.error('Modal requires an accessible name. Add <Modal.Title> or pass ariaLabel.');
  }, [ariaLabel, isOpen, titleId]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || !isTopMost) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose?.();
      return;
    }

    if (e.key === 'Tab') {
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

  if (!isOpen || typeof document === 'undefined') return null;

  const close = () => onClose?.();
  const variantAttr = variant ?? 'modal';
  const themeAttr = theme ?? 'default';
  const contextValue: ModalContextValue = {
    titleId,
    close,
  };

  const ariaLabelledBy = ariaLabel ? undefined : titleId;
  const rootClasses =
    'modal modal__overlay | p-sm items-center justify-center bg-overlay flex inset-0 fixed z-50 opacity-100 pointer-events-auto';
  const dialogClasses =
    'modal__dialog | overflow-hidden flex flex-col outline-none ring-4 ring-selected-border ring-offset-4 rounded-4xl';

  return createPortal(
    <div
      id={id}
      data-variant={variantAttr}
      data-theme={themeAttr}
      onClick={handleOverlayClick}
      role="none"
      className={rootClasses}
    >
      {/* Dialog owns Escape and Tab handling for the focus trap. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-hidden={isTopMost ? undefined : true}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onKeyDown={handleKeyDown}
        className={dialogClasses}
        tabIndex={-1}
      >
        <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
      </div>
    </div>,
    getModalPortalRoot()
  );
}

type ModalSlot = {
  children: ReactNode;
  className?: string;
};

type ModalPanelProps = ModalSlot & {
  size?: 'default' | 'narrow' | 'wide';
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

/**
 * <Modal.Header> — structural wrapper for the header area
 */
function ModalHeader({ children, className }: Readonly<ModalSlot>) {
  return (
    <header className={cx('modal-panel__header', 'flex items-center justify-between', className)}>
      {children}
    </header>
  );
}

/**
 * <Modal.Title> — accessible title, wires up aria-labelledby via titleId
 */
function ModalTitle({ children, className }: Readonly<ModalSlot>) {
  const { titleId } = useModalContext('Modal.Title');
  return (
    <h2
      id={titleId}
      className={className}
    >
      {children}
    </h2>
  );
}

/**
 * <Modal.CloseButton> — standardised close button hooked into Modal.close()
 */
type ModalCloseButtonProps = {
  ariaLabel?: string;
  callback?: () => void;
};

function ModalCloseButton({
  ariaLabel = 'Close dialog',
  callback,
}: Readonly<ModalCloseButtonProps>) {
  const { close } = useModalContext('Modal.CloseButton');
  const handleClose = () => {
    callback?.();
    close();
  };
  return (
    <Button
      type="button"
      onClick={handleClose}
      ariaLabel={ariaLabel}
      iconOnly
      icon="close"
      className="justify-center"
      variant="primary"
      size="small"
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
 * <Modal.Panel> — standard modal surface with consistent sizing
 */
function ModalPanel({ children, className, size = 'default' }: Readonly<ModalPanelProps>) {
  const sizeClass =
    size === 'narrow' ? 'modal-panel--narrow' : size === 'wide' ? 'modal-panel--wide' : undefined;

  return (
    <Modal.Body
      className={cx(
        'modal-panel',
        'bg-surface text-text gap-sm p-md grid overflow-hidden rounded-3xl',
        sizeClass,
        className
      )}
    >
      {children}
    </Modal.Body>
  );
}

/**
 * <Modal.Content> — scrollable content region inside a modal panel
 */
function ModalContent({ children, className }: Readonly<ModalSlot>) {
  return (
    <div className={cx('modal-panel__content', 'px-sm pb-xs overflow-auto pt-0', className)}>
      {children}
    </div>
  );
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
  Panel: ModalPanel,
  Content: ModalContent,
  Footer: ModalFooter,
});

export {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPanel,
  ModalRoot,
  ModalTitle,
};

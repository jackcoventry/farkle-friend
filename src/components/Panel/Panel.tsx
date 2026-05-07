import { type ComponentPropsWithoutRef, forwardRef } from 'react';

type PanelProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export const Panel = forwardRef<HTMLElement, PanelProps>(function Panel(
  { children, className, ...props },
  ref
) {
  return (
    <section
      ref={ref}
      className={`bg-surface-raised border-border text-text p-md rounded-3xl border ${className || ''}`}
      {...props}
    >
      {children}
    </section>
  );
});

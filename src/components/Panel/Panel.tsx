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
      className={`rounded-3xl bg-surface-raised border border-border text-text p-4 ${className || ''}`}
      {...props}
    >
      {children}
    </section>
  );
});

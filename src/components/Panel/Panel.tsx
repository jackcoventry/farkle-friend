import { forwardRef, type ComponentPropsWithoutRef } from "react";

type PanelProps = ComponentPropsWithoutRef<"section"> & {
  className?: string;
};

export const Panel = forwardRef<HTMLElement, PanelProps>(function Panel(
  { children, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={`rounded-3xl bg-gray-700 border border-gray-200 text-white p-4 ${className || ""}`}
      {...props}
    >
      {children}
    </section>
  );
});

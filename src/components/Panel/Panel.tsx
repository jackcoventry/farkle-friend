import { PropsWithChildren } from "react";

type PanelProps = {
  className?: string;
};

export function Panel({
  children,
  className,
  ...props
}: PropsWithChildren<PanelProps>) {
  return (
    <section
      className={`rounded-3xl bg-gray-700 border border-gray-200 text-white p-4 ${className || ""}`}
      {...props}
    >
      {children}
    </section>
  );
}

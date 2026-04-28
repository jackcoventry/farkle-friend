import React from "react";
import "./Pill.css";

type PillProps = {
  children: React.ReactNode;
};

type PillLabelProps = {
  children: React.ReactNode;
  htmlFor: string;
};

export default function Pill({ children }: Readonly<PillProps>) {
  let control: React.ReactElement | undefined;
  let label: React.ReactElement | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === Pill.Control) control = child;
    if (child.type === Pill.Label) label = child;
  });

  return (
    <span className="pill">
      {control}
      {label}
    </span>
  );
}

Pill.Control = function PillControl({ children }: Readonly<PillProps>) {
  return <span className="pill-control">{children}</span>;
};

Pill.Label = function PillLabel({
  children,
  htmlFor,
}: Readonly<PillLabelProps>) {
  return (
    <label htmlFor={htmlFor} className="pill-label">
      {children}
    </label>
  );
};

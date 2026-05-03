import React from "react";
import "./Pill.css";

type PillProps = {
  children: React.ReactNode;
  className?: string;
};

type PillLabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
};

type PillControlProps = {
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function Pill({ children, className }: Readonly<PillProps>) {
  let control: React.ReactElement | undefined;
  let label: React.ReactElement | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === Pill.Control) control = child;
    if (child.type === Pill.Label) label = child;
  });

  return (
    <span className={mergeClassNames("pill", className)}>
      {control}
      {label}
    </span>
  );
}

Pill.Control = function PillControl({ children }: Readonly<PillControlProps>) {
  if (
    !React.isValidElement<React.InputHTMLAttributes<HTMLInputElement>>(children)
  ) {
    return null;
  }

  return React.cloneElement(children, {
    className: mergeClassNames("pill-input", children.props.className),
  });
};

Pill.Label = function PillLabel({
  children,
  className,
  htmlFor,
}: Readonly<PillLabelProps>) {
  return (
    <label
      htmlFor={htmlFor}
      className={mergeClassNames("pill-box", className)}
    >
      <span className="pill-box__indicator" aria-hidden="true" />
      <span className="pill-box__label">{children}</span>
    </label>
  );
};

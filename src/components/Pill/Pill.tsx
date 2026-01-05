import React from "react";
import "./Pill.css";

export default function Pill({ children }) {
  let control, label;

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

Pill.Control = function PillControl({ children }) {
  return <span className="pill-control">{children}</span>;
};

Pill.Label = function PillLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="pill-label">
      {children}
    </label>
  );
};

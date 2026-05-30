import {
  Children,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react';
import './Pill.css';

type PillProps = {
  children: ReactNode;
  className?: string;
};

type PillLabelProps = {
  children: ReactNode;
  htmlFor: string;
  className?: string;
};

type PillControlProps = {
  children: ReactElement<InputHTMLAttributes<HTMLInputElement>>;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function Pill({ children, className }: Readonly<PillProps>) {
  let control: ReactElement | undefined;
  let label: ReactElement | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Pill.Control) control = child;
    if (child.type === Pill.Label) label = child;
  });

  return (
    <span className={mergeClassNames('pill | relative inline-flex min-w-0', className)}>
      {control}
      {label}
    </span>
  );
}

Pill.Control = function PillControl({ children }: Readonly<PillControlProps>) {
  if (!isValidElement<InputHTMLAttributes<HTMLInputElement>>(children)) {
    return null;
  }

  return cloneElement(children, {
    className: mergeClassNames('pill-input', children.props.className),
  });
};

Pill.Label = function PillLabel({ children, className, htmlFor }: Readonly<PillLabelProps>) {
  return (
    <label
      htmlFor={htmlFor}
      className={mergeClassNames(
        'pill-box | border-control-border text-control-text bg-control gap-xs px-md py-xs inline-grid cursor-pointer items-center rounded-full border-2',
        className
      )}
    >
      <span
        className="pill-box__indicator | inline-flex size-4 items-center justify-center rounded-full border-2 border-inherit"
        aria-hidden="true"
      />
      <span className="pill-box__label | min-w-0">{children}</span>
    </label>
  );
};

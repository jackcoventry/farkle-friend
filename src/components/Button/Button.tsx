import React from "react";

type CommonProps = {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  iconOnly?: boolean;
  iconPosition?: "left" | "right";
  size?: "default" | "small";
  variant?: "primary" | "secondary";
};

type ButtonOnlyProps = {
  as?: "button";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "disabled" | "className" | "children" | "aria-label"
>;

type AnchorOnlyProps = {
  as: "a";
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  rel?: string;
  target?: React.HTMLAttributeAnchorTarget;
  // Disallow button-only props on anchors
  disabled?: never;
  type?: never;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "className" | "children" | "aria-label"
>;

type InlineOnlyProps = {
  as?: "span";
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "disabled" | "className" | "children" | "aria-label"
>;

type ButtonProps = CommonProps &
  (ButtonOnlyProps | AnchorOnlyProps | InlineOnlyProps);
const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Readonly<ButtonProps>
>(function ButtonRoot(props, ref) {
  const {
    ariaLabel,
    children,
    className = "",
    icon,
    iconOnly = false,
    iconPosition = "right",
    size = "default",
    variant = "primary",
    ...rest
  } = props;

  let classes =
    "button | bg-sun-200 hover:bg-sun-300 rounded-lg inline-flex gap-3 p-4 cursor-pointer";
  if (className) {
    classes += ` | ${className}`;
  }

  // If iconOnly and no ariaLabel, fall back to string children
  let computedAriaLabel = ariaLabel;
  if (!computedAriaLabel && iconOnly && typeof children === "string") {
    computedAriaLabel = children;
  }

  if (props.as === "a") {
    const { href, target, rel, onClick, ...anchorRest } =
      rest as AnchorOnlyProps;
    const relSafe = target === "_blank" ? rel || "noopener noreferrer" : rel;

    return (
      <a
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        href={href}
        rel={relSafe}
        ref={ref as React.Ref<HTMLAnchorElement>}
        target={target}
        {...anchorRest}
      >
        {children && !iconOnly && (
          <span className="content | ">{children}</span>
        )}
        {icon && (
          <span>
            <svg
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use xlinkHref={`/icons/icons.svg#${icon}`} />
            </svg>
          </span>
        )}
      </a>
    );
  }

  if (props.as === "span") {
    return (
      <span
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children && !iconOnly && (
          <span className="content | ">{children}</span>
        )}
        {icon && (
          <span>
            <svg
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use xlinkHref={`/icons/icons.svg#${icon}`} />
            </svg>
          </span>
        )}
      </span>
    );
  }

  const {
    type = "button",
    disabled = false,
    onClick,
    ...buttonRest
  } = rest as ButtonOnlyProps;

  return (
    <button
      aria-label={computedAriaLabel}
      className={classes}
      data-icon-position={iconPosition}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      type={type}
      disabled={disabled}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...buttonRest}
    >
      {children && !iconOnly && <span className="content">{children}</span>}
      {icon && (
        <span className="icon">
          <svg
            className="icon"
            width="1.25em"
            height="1.25em"
            fill="currentColor"
          >
            <use xlinkHref={`/icons/icons.svg#${icon}`} />
          </svg>
        </span>
      )}
    </button>
  );
});

export default Button;

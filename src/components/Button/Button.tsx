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

/* -----------------------------
   BUTTON PROPS
----------------------------- */
type ButtonOnlyProps = {
  as?: "button";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "disabled" | "className" | "children" | "aria-label"
>;

/* -----------------------------
   ANCHOR PROPS
----------------------------- */
type AnchorOnlyProps = {
  as: "a";
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  rel?: string;
  target?: React.HTMLAttributeAnchorTarget;

  disabled?: never;
  type?: never;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "className" | "children" | "aria-label"
>;

/* -----------------------------
   INLINE SPAN PROPS
----------------------------- */
type InlineOnlyProps = {
  as: "inline";
} & Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "className" | "children" | "aria-label"
>;

/* -----------------------------
   ALL POSSIBLE PROPS
----------------------------- */
type ButtonProps = CommonProps &
  (ButtonOnlyProps | AnchorOnlyProps | InlineOnlyProps);

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
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
    "button | bg-sun-200 hover:bg-sun-300 rounded-lg flex gap-3 p-4 cursor-pointer";
  if (className) classes += ` | ${className}`;

  // If iconOnly and no ariaLabel, fall back to children (if string)
  let computedAriaLabel = ariaLabel;
  if (!computedAriaLabel && iconOnly && typeof children === "string") {
    computedAriaLabel = children;
  }

  /* -----------------------------
      INLINE SPAN
  ----------------------------- */
  if (props.as === "inline") {
    const inlineRest = rest as InlineOnlyProps;

    return (
      <span
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        ref={ref as React.Ref<HTMLSpanElement>}
        {...inlineRest}
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

  /* -----------------------------
      ANCHOR
  ----------------------------- */
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
        target={target}
        ref={ref as React.Ref<HTMLAnchorElement>}
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

  /* -----------------------------
      BUTTON
  ----------------------------- */
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

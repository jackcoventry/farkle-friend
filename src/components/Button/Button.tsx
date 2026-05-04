import React from "react";

/* -----------------------------
   COMMON PROPS
----------------------------- */
type CommonProps = {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  iconOnly?: boolean;
  iconPosition?: "left" | "right";
  size?: "default" | "small" | "large";
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
  disabled?: never;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  rel?: string;
  target?: React.HTMLAttributeAnchorTarget;
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
export type ButtonProps = CommonProps &
  (ButtonOnlyProps | AnchorOnlyProps | InlineOnlyProps);

function getVariantClasses(variant: CommonProps["variant"]) {
  if (variant === "secondary") {
    return "border-pink-700 shadow-purple-500 bg-white text-black hover:border-pink-500 shadow-offset-solid-style";
  }

  return "border-pink-500 shadow-pink-700 bg-pink-500 text-white hover:bg-pink-400 hover:border-purple-500 shadow-offset-solid-style";
}

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

  let classes = "button | rounded-full flex relative border-2";
  if (className) classes += ` | ${className}`;
  if (size === "small") classes += " font-button-small gap-3 py-2 px-5";
  if (size === "default") classes += " font-button py-3 gap-4 px-6";
  if (size === "large") classes += " font-button-large gap-5 py-4 px-8";

  if (iconPosition === "left") classes += " flex-row-reverse";

  const childrenWrapper =
    "content | w-full display flex justify-center align-center";

  // If iconOnly and no ariaLabel, fall back to children (if string)
  let computedAriaLabel = ariaLabel;
  if (!computedAriaLabel && iconOnly && typeof children === "string") {
    computedAriaLabel = children;
  }

  /* -----------------------------
      INLINE SPAN
  ----------------------------- */
  if (props.as === "inline") {
    const { as, ...inlineRest } = rest as InlineOnlyProps;
    void as;

    classes += ` ${getVariantClasses(variant)}`;

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
          <span className={childrenWrapper}>{children}</span>
        )}
        {icon && (
          <span className="inline-flex items-center">
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
    const { as, href, target, rel, onClick, ...anchorRest } =
      rest as AnchorOnlyProps;
    void as;

    const relSafe = target === "_blank" ? rel || "noopener noreferrer" : rel;

    classes += ` cursor-pointer ${getVariantClasses(variant)}`;

    return (
      <a
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        href={href}
        onClick={onClick}
        rel={relSafe}
        target={target}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...anchorRest}
      >
        {children && !iconOnly && (
          <span className={childrenWrapper}>{children}</span>
        )}
        {icon && (
          <span className="inline-flex items-center">
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
  if (disabled) {
    classes += " bg-gray-500 cursor-not-allowed text-white";
  } else {
    classes += ` cursor-pointer ${getVariantClasses(variant)}`;
  }

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
      {children && !iconOnly && (
        <span className={childrenWrapper}>{children}</span>
      )}
      {icon && (
        <span className="inline-flex items-center">
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

import icons from '@/design-tokens/icons.json';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributeAnchorTarget,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
  forwardRef,
} from 'react';

/* -----------------------------
   COMMON PROPS
----------------------------- */
type ButtonA11yProps =
  | {
      ariaLabel: string;
      iconOnly: boolean;
    }
  | {
      ariaLabel?: string;
      iconOnly?: false;
    };

type CommonProps = ButtonA11yProps & {
  children?: ReactNode;
  className?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  size?: 'default' | 'small' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary';
};

/* -----------------------------
   BUTTON PROPS
----------------------------- */
type ButtonOnlyProps = {
  as?: 'button';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'className' | 'children' | 'aria-label'
>;

/* -----------------------------
   ANCHOR PROPS
----------------------------- */
type AnchorOnlyProps = {
  as: 'a';
  disabled?: never;
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
  type?: never;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'onClick' | 'className' | 'children' | 'aria-label'
>;

/* -----------------------------
   INLINE SPAN PROPS
----------------------------- */
type InlineOnlyProps = {
  as: 'inline';
  /**
   * Inline is for presentation only.
   */
  onClick?: never;
  onKeyDown?: never;
  onKeyUp?: never;
  onKeyPress?: never;
  tabIndex?: never;
  role?: never;
} & Omit<
  HTMLAttributes<HTMLSpanElement>,
  | 'className'
  | 'children'
  | 'aria-label'
  | 'onClick'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'tabIndex'
  | 'role'
>;

/* -----------------------------
   ALL POSSIBLE PROPS
----------------------------- */
export type ButtonProps = CommonProps & (ButtonOnlyProps | AnchorOnlyProps | InlineOnlyProps);

const buttonIconNames = new Set<string>(icons.icons);

function getRenderableIconName(icon: string | undefined) {
  const iconName = icon?.trim();

  if (!iconName || !buttonIconNames.has(iconName)) return undefined;

  return iconName;
}

function getVariantClasses(variant: CommonProps['variant']) {
  if (variant === 'tertiary') {
    return 'border-border shadow-accent-shadow active:shadow-none active:translate-px bg-surface-muted text-text hover:bg-accent-muted hover:border-accent shadow-offset-solid-style';
  }

  if (variant === 'secondary') {
    return 'border-control-border shadow-control-shadow active:shadow-none active:translate-px bg-control text-control-text hover:bg-control-hover hover:border-accent shadow-offset-solid-style';
  }

  return 'border-accent shadow-accent-shadow active:shadow-none active:translate-px bg-accent text-accent-contrast hover:bg-accent-hover hover:border-action-border shadow-offset-solid-style';
}

function getButtonClasses({
  className,
  disabled,
  iconPosition,
  size,
  variant,
}: {
  className: string;
  disabled?: boolean;
  iconPosition: CommonProps['iconPosition'];
  size: CommonProps['size'];
  variant: CommonProps['variant'];
}) {
  let classes = 'button | rounded-full flex relative border-2';
  if (className) classes += ` | ${className}`;
  if (size === 'small') classes += ' font-button-small gap-sm py-xs px-lg';
  if (size === 'default') classes += ' font-button py-sm gap-md px-xl';
  if (size === 'large') classes += ' font-button-large gap-lg py-md px-3xl';
  if (iconPosition === 'left') classes += ' flex-row-reverse';

  if (disabled) {
    return `${classes} bg-surface-disabled border-surface-disabled cursor-not-allowed text-text`;
  }

  return `${classes} cursor-pointer ${getVariantClasses(variant)}`;
}

function getComputedAriaLabel({
  ariaLabel,
  children,
  iconOnly,
}: {
  ariaLabel?: string;
  children?: ReactNode;
  iconOnly: boolean;
}) {
  if (ariaLabel) return ariaLabel;
  if (iconOnly && typeof children === 'string') return children;
  return undefined;
}

function renderButtonContent({
  children,
  icon,
  iconOnly,
}: {
  children?: ReactNode;
  icon?: string;
  iconOnly: boolean;
}) {
  const iconName = getRenderableIconName(icon);

  return (
    <>
      {children && !iconOnly && (
        <span className="content | flex w-full items-center justify-center">{children}</span>
      )}
      {iconName && (
        <span
          className="inline-flex items-center"
          data-slot="button-icon"
        >
          <svg
            aria-hidden="true"
            className="icon"
            width="1.25em"
            height="1.25em"
            fill="currentColor"
          >
            <use xlinkHref={`/icons/icons.svg#${iconName}`} />
          </svg>
        </span>
      )}
    </>
  );
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement,
  Readonly<ButtonProps>
>(function ButtonRoot(props, ref) {
  const {
    ariaLabel,
    children,
    className = '',
    icon,
    iconOnly = false,
    iconPosition = 'right',
    size = 'default',
    variant = 'primary',
    ...rest
  } = props;

  const computedAriaLabel = getComputedAriaLabel({ ariaLabel, children, iconOnly });
  const content = renderButtonContent({ children, icon, iconOnly });

  /* -----------------------------
      INLINE SPAN
  ----------------------------- */
  if (props.as === 'inline') {
    const { as, ...inlineRest } = rest as InlineOnlyProps;
    void as;

    const classes = getButtonClasses({ className, iconPosition, size, variant });

    return (
      <span
        aria-label={computedAriaLabel}
        className={classes}
        data-icon-position={iconPosition}
        data-size={size}
        data-variant={variant}
        ref={ref as Ref<HTMLSpanElement>}
        {...inlineRest}
      >
        {content}
      </span>
    );
  }

  /* -----------------------------
      ANCHOR
  ----------------------------- */
  if (props.as === 'a') {
    const { as, href, target, rel, onClick, ...anchorRest } = rest as AnchorOnlyProps;
    void as;

    const relSafe = target === '_blank' ? rel || 'noopener noreferrer' : rel;

    const classes = getButtonClasses({ className, iconPosition, size, variant });

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
        ref={ref as Ref<HTMLAnchorElement>}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  /* -----------------------------
      BUTTON
  ----------------------------- */
  const { type = 'button', disabled = false, onClick, ...buttonRest } = rest as ButtonOnlyProps;
  const classes = getButtonClasses({ className, disabled, iconPosition, size, variant });

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
      ref={ref as Ref<HTMLButtonElement>}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

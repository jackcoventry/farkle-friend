import React from "react";
import { DynamicImage } from "@/components/DynamicImage/DynamicImage";
import "./RichButton.css";

export type Icons = "dice" | "rocket" | "bank" | "cancel";
export type RichButtonProps = {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: Icons;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
};

const RichButton = React.forwardRef<
  HTMLButtonElement,
  Readonly<RichButtonProps>
>(function RichButtonRoot(props: RichButtonProps, ref) {
  const {
    ariaLabel,
    children,
    className,
    disabled,
    icon,
    onClick,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`rich-button | ${disabled ? " cursor-not-allowed" : " hover:opacity-85 cursor-pointer"} ${className ? ` ${className}` : ""}`}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={`h-[100px] w-[100px]  flex rounded-full justify-center items-center mx-auto relative z-0 p-5 ${disabled ? " bg-gray-600" : " bg-red-500"}`}
        >
          <DynamicImage
            name={icon}
            className={`w-8 h-8${disabled ? " grayscale" : ""}`}
          />
        </span>
      )}
      {children && (
        <span
          className={`py-4 px-6 z-10 relative font-heading rounded-lg text-white ${disabled ? " bg-gray-600" : " bg-red-500"}`}
        >
          {children}
        </span>
      )}
    </button>
  );
});

export default RichButton;

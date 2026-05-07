import type { CSSProperties } from 'react';
import { DynamicImage, type ImageKey } from '@/components/DynamicImage/DynamicImage';
import './TurnActionCluster.css';

export type TurnAction = {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ImageKey;
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

type TurnActionClusterProps = {
  actions: TurnAction[];
  ariaLabel?: string;
  className?: string;
};

export function TurnActionCluster({
  actions,
  ariaLabel = 'Turn actions',
  className,
}: Readonly<TurnActionClusterProps>) {
  return (
    <div
      className={`turn-action-cluster | grid-cols-[1fr] shadow-accent-shadow shadow-offset-solid-style rounded-lg items-stretch xl:rounded-full grid w-full xl:flex${className ? ` ${className}` : ''}`}
      style={
        {
          '--turn-action-count': actions.length,
        } as CSSProperties
      }
      aria-label={ariaLabel}
      role="group"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type={action.type ?? 'button'}
          aria-describedby={action.ariaDescribedBy}
          aria-label={action.ariaLabel}
          className="turn-action-cluster__button | focus-visible:z-10 items-center text-action-contrast bg-action cursor-pointer flex gap-2 justify-center relative p-3 disabled:bg-surface-disabled disabled:text-text-muted disabled:cursor-not-allowed"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          <span
            className="turn-action-cluster__icon | items-center rounded-full inline-flex justify-center p-2"
            aria-hidden="true"
          >
            <DynamicImage
              name={action.icon}
              alt=""
            />
          </span>
          <span className="turn-action-cluster__label | text-center">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

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
      className={`turn-action-cluster | shadow-accent-shadow md:shadow-offset-solid-style grid w-full items-stretch rounded-lg xl:rounded-full xl:flex${className ? ` ${className}` : ''}`}
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
          className="turn-action-cluster__button | text-action-contrast bg-action gap-xs p-sm disabled:bg-surface-disabled disabled:text-text-muted relative flex cursor-pointer items-center justify-center focus-visible:z-10 disabled:cursor-not-allowed"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          <span
            className="turn-action-cluster__icon | p-xs inline-flex items-center justify-center rounded-full"
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

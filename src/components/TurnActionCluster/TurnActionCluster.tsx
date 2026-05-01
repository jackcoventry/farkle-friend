import { DynamicImage, type ImageKey } from "@/components/DynamicImage/DynamicImage";
import "./TurnActionCluster.css";

export type TurnAction = {
  ariaDescribedBy?: string;
  disabled?: boolean;
  icon: ImageKey;
  label: string;
  onClick: () => void;
};

type TurnActionClusterProps = {
  actions: TurnAction[];
};

export function TurnActionCluster({
  actions,
}: Readonly<TurnActionClusterProps>) {
  return (
    <div className="turn-action-cluster" aria-label="Turn actions">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          aria-describedby={action.ariaDescribedBy}
          className="turn-action-cluster__button"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          <span className="turn-action-cluster__icon" aria-hidden="true">
            <DynamicImage name={action.icon} alt="" />
          </span>
          <span className="turn-action-cluster__label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

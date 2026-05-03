import {
  DynamicImage,
  type ImageKey,
} from "@/components/DynamicImage/DynamicImage";
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
    <div
      className="turn-action-cluster | grid-cols-[1fr] rounded-lg items-stretch bg-pink-500 border-2 border-purple-500 xl:rounded-full grid gap-1 overflow-hidden w-full xl:flex"
      aria-label="Turn actions"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          aria-describedby={action.ariaDescribedBy}
          className="turn-action-cluster__button | xl:flex-[1_1_0] items-center text-white cursor-pointer flex gap-2 justify-center relative p-3 disabled:bg-gray-600 disabled:color-gray-200 disabled:cursor-not-allowed"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          <span
            className="turn-action-cluster__icon | items-center rounded-full inline-flex justify-center p-2"
            aria-hidden="true"
          >
            <DynamicImage name={action.icon} alt="" />
          </span>
          <span className="turn-action-cluster__label | text-center">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

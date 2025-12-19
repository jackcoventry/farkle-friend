import { DiceStyle } from "@/domain/game/gameTypes";
import "./DiceIcon.css";

type DiceIconProps = {
  className?: string;
  count: number;
  state?: "default" | "disabled" | "active";
  variant?: DiceStyle;
};

function DiceIcon({
  className,
  count = 1,
  state,
  variant = "default",
}: Readonly<DiceIconProps>) {
  let classes = "dice-icon";
  if (className) {
    classes += ` ${className}`;
  }
  return (
    <div
      aria-label={`A dice with ${count} spot${count === 1 ? "" : "s"}`}
      className={classes}
      data-count={count}
      data-state={state}
      data-variant={variant}
    >
      {[...new Array(count).keys()].map((e) => (
        <span className="dice-dot" key={e} />
      ))}
    </div>
  );
}

export default DiceIcon;

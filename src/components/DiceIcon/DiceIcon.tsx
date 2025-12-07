import "./DiceIcon.css";

type DiceIconProps = {
  count: number;
};

function DiceIcon({ count = 1 }: Readonly<DiceIconProps>) {
  return (
    <div
      className="dice-icon"
      data-count={count}
      aria-label={`A dice with ${count} spot${count === 1 ? "" : "s"}`}
    >
      {[...new Array(count).keys()].map((e) => (
        <span className="dice-dot" key={e} />
      ))}
    </div>
  );
}

export default DiceIcon;

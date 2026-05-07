import './DiceIcon.css';

type DiceIconProps = {
  className?: string;
  count: number;
  state?: 'default' | 'disabled' | 'active';
};

function DiceIcon({ className, count = 1, state }: Readonly<DiceIconProps>) {
  let classes = 'dice-icon | aspect-square grid relative';
  if (className) {
    classes += ` ${className}`;
  }
  return (
    <div
      aria-label={`A dice with ${count} spot${count === 1 ? '' : 's'}`}
      className={classes}
      data-count={count}
      data-state={state}
      role="img"
    >
      {[...new Array(count).keys()].map((e) => (
        <span
          className="dice-dot | absolute block rounded-full"
          key={e}
        />
      ))}
    </div>
  );
}

export default DiceIcon;

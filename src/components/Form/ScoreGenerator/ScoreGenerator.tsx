import DiceIcon from "@/components/DiceIcon/DiceIcon";
import RichButton from "@/components/RichButton/RichButton";
import { DieValue } from "@/domain/game/dice";
import React from "react";

type ScoreGeneratorProps = {
  onChange: (selectedItems: DieValue[]) => void;
};

function ScoreGenerator({ onChange }: Readonly<ScoreGeneratorProps>) {
  const dies = Array.from({ length: 6 }, (_, i) => i + 1);
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [clicked, setClicked] = React.useState<number>();
  const handleClick = (die: number) => {
    setClicked(die);
    setSelectedItems([...selectedItems, die]);
    setTimeout(() => setClicked(undefined), 200);
  };
  const handleSubmit = () => {
    onChange(selectedItems as DieValue[]);
    setSelectedItems([]);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-5 mx-auto h-[200px] w-[300px]">
        {dies.map((die) => {
          const classes = `enabled:hover:opacity-50 enabled:hover:scale-110 enabled:cursor-pointer transition-transform disabled:grayscale-50 disabled:cursor-not-allowed ${die === clicked ? "enabled:hover:scale-120 " : ""}`;
          return (
            <button
              key={die}
              onClick={() => handleClick(die)}
              disabled={selectedItems.length >= 6}
              className={classes}
            >
              <DiceIcon count={die} className="w-full" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col items-center gap-4">
        <p className="font-heading h-9">{selectedItems.toString()}</p>
        <RichButton
          icon="bank"
          disabled={selectedItems.length === 0}
          onClick={handleSubmit}
        >
          Save selection
        </RichButton>
      </div>
    </>
  );
}
export default ScoreGenerator;

import { DieValue } from "./diceTypes";

export function rollDice(count: number = 6): DieValue[] {
  return Array.from(
    { length: count },
    () => (Math.floor(Math.random() * 6) + 1) as DieValue
  );
}

export function getScoringInfo(dice: DieValue[]) {
  // TODO: add logic here
}

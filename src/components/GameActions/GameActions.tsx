import Button from "@/components/Button/Button";

type GameActionsProps = {
  onQuit: () => void;
  onRestart: () => void;
};

export function GameActions({ onQuit, onRestart }: Readonly<GameActionsProps>) {
  return (
    <section className="mt-4 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Button onClick={onRestart} className="justify-center" size="small">
          Restart game
        </Button>
        <Button onClick={onQuit} className="justify-center" size="small">
          Quit to setup
        </Button>
      </div>
    </section>
  );
}

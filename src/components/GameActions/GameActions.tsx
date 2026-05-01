import Button from "@/components/Button/Button";

type GameActionsProps = {
  onQuit: () => void;
  onRestart: () => void;
};

export function GameActions({ onQuit, onRestart }: Readonly<GameActionsProps>) {
  return (
    <section className="mt-4 flex flex-col gap-2">
      {/* <p className="rounded-lg bg-white/80 p-3 text-sm">
        Closing or refreshing this tab ends the current game.
      </p> */}
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

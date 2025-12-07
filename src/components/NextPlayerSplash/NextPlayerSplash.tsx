import { Player } from "@/domain/game/gameTypes";
import "./NextPlayerSplash.css";

type NextPlayerSplashProps = {
  player: Player;
};

function NextPlayerSplash({ player }: Readonly<NextPlayerSplashProps>) {
  if (!player) return;

  return (
    <div className="splash-wrapper | flex h-dvh w-dvw justify-center items-center overflow-hidden fixed">
      <div className="splash-background | block h-[2000px] w-[2000px] overflow-hidden absolute">
        <div className="splash-spinner | block h-full w-full left-0 top-0 overflow-hidden absolute -z-0" />
      </div>

      <div className="splash-content | animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center shadow-lg rounded-2xl">
        <h2 className="font-heading">{player.username}'s turn!</h2>
        <figure className="rounded-full overflow-hidden w-[200px] mx-auto my-4">
          <img
            src={`/avatar/${player.avatar}.svg`}
            alt="The user's selected avatar of a playful illustration"
            className="splash-avatar | "
          />
        </figure>

        <p className="font-sub-heading">Current score:</p>
        <p className="font-mega">{player.totalScore}</p>
      </div>
    </div>
  );
}

export default NextPlayerSplash;

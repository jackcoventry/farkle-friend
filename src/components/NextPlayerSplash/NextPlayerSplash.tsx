import { Player } from "@/domain/game/gameTypes";

type NextPlayerSplashProps = {
  player: Player;
};

function NextPlayerSplash({ player }: Readonly<NextPlayerSplashProps>) {
  if (!player) return;

  return (
    <div className="animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center shadow-lg rounded-2xl">
      <h2 className="font-heading">{player.username}'s turn!</h2>
      <figure className="rounded-full overflow-hidden w-[200px] mx-auto my-4">
        <img
          src={`/avatar/${player.avatar}.svg`}
          alt="The user's selected avatar of a playful illustration"
          className="splash-avatar | w-[200px]"
        />
      </figure>

      <p className="font-sub-heading">Current score:</p>
      <p className="font-mega">{player.totalScore}</p>
    </div>
  );
}

export default NextPlayerSplash;

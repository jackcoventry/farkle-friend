import { Player } from "@/domain/game/gameTypes";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";

type SplashProps = {
  player: Player;
};

function Splash({ player }: Readonly<SplashProps>) {
  if (!player) return;

  const avatar = avatarSet[player.avatar as AvatarId];

  // TODO: this component can be re-used
  return (
    <div className="animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center rounded-3xl">
      <h2 className="font-heading">{`${player.username}'s turn!`}</h2>
      <figure
        className={`rounded-full overflow-hidden w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
      >
        <img
          src={avatar.image}
          alt="The user's selected avatar of a playful illustration"
          className="splash-avatar | w-[200px] h-[200px]"
        />
      </figure>

      <p className="font-sub-heading">Current score:</p>
      <p className="font-mega">{player.totalScore}</p>
    </div>
  );
}

export default Splash;

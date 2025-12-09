import { Player } from "@/domain/game/gameTypes";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";
import Button from "../Button/Button";
import { useGameState } from "@/hooks/useGameState";

type WinnerSplashProps = {
  player: Player;
};

function WinnerSplash({ player }: Readonly<WinnerSplashProps>) {
  if (!player) return;

  const { state, dispatch } = useGameState();
  const avatar = avatarSet[player.avatar as AvatarId];

  const onResetGame = () => {
    dispatch({ type: "RESET_GAME" });
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="animate-bounce-in bg-white w-[500px] p-8 flex flex-col gap-4 text-center rounded-3xl">
      <h2 className="font-heading">{`${player.username} wins!`}</h2>
      <figure
        className={`splash-avatar-image | rounded-full overflow-hidden w-[200px] h-[200px] mx-auto my-4 p-6 flex items-center justify-center ${avatar.color}`}
      >
        <img
          src={avatar.image}
          alt="The user's selected avatar of a playful illustration"
          className="splash-avatar | w-[200px] h-[200px]"
        />
      </figure>

      <Button onClick={onResetGame} className="justify-center">
        Another game?
      </Button>
      <Button as="a" href="/game" className="justify-center">
        New players
      </Button>
    </div>
  );
}

export default WinnerSplash;

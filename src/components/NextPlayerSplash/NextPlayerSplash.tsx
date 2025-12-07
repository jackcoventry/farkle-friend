import { Player } from "@/domain/game/gameTypes";
import "./NextPlayerSplash.css";

type NextPlayerSplashProps = {
  player: Player;
};

function NextPlayerSplash({ player }: Readonly<NextPlayerSplashProps>) {
  if (!player) return;

  return (
    <div className="splash-wrapper">
      <div className="splash-background">
        <div className="splash-spinner" />
        <div className="splash-track" data-size="small" data-speed="fast" />
        <div className="splash-track" data-size="medium" data-speed="medium" />
        <div className="splash-track" data-size="large" data-speed="slow" />
      </div>

      <div className="splash-content">
        <h2 className="font-mega">{player.username}'s turn!</h2>
        <img
          src={`/avatar/${player.avatar}.svg`}
          alt="The user's selected avatar of a playful illustration"
          className="splash-avatar"
        />

        <p>Current score: {player.totalScore}</p>
      </div>
    </div>
  );
}

export default NextPlayerSplash;

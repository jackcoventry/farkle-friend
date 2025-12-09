import { Player } from "@/domain/game/gameTypes";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";

type PlayerListProps = {
  activePlayerId?: string;
  players: Player[];
};

function PlayerList({
  activePlayerId,
  players = [],
}: Readonly<PlayerListProps>) {
  return (
    <ul className="player-list">
      {players.map((player) => {
        const classes = `flex p-2 gap-3 ${player.id === activePlayerId ? "border-l-4 border-red-300 bg-amber-100 hover:bg-amber-50" : "bg-gray-50 : hover:bg-gray-100"}`;
        const avatar = avatarSet[player.avatar as AvatarId];

        return (
          <li key={player.id} className={classes}>
            <img
              src={avatar.image}
              className={`w-[60px] h-[60px] rounded-full p-2 border-white border-2 ring ${avatar.color}`}
              alt="The user's selected avatar of a playful illustration"
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-heading-2">{player.username}</h3>
              {!!player.totalScore && (
                <span className="block text-red-500">{player.totalScore}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default PlayerList;

import { Player } from "@/domain/game/gameTypes";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";
import Image from "next/image";

type PlayerListProps = {
  activePlayerId?: string;
  onRemovePlayer?: (playerId: string) => void;
  players: Player[];
};

function PlayerList({
  activePlayerId,
  onRemovePlayer,
  players = [],
}: Readonly<PlayerListProps>) {
  return (
    <ul className="player-list">
      {players.map((player) => {
        const classes = `flex p-3 gap-3 ${player.id === activePlayerId ? "border-l-4 border-red-300 bg-amber-100 hover:bg-amber-50" : "hover:bg-gray-100"}`;
        const avatar = avatarSet[player.avatar as AvatarId];

        return (
          <li key={player.id} className={classes}>
            <Image
              src={avatar.image}
              className={`w-[60px] h-[60px] rounded-full p-2 border-white border-2 ring ${avatar.color}`}
              alt={`${player.username}'s ${avatar.name} avatar`}
              width={60}
              height={60}
              style={{ height: 60, width: 60 }}
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-heading-2">{player.username}</h3>
              {!!player.totalScore && (
                <span className="block text-red-500">{player.totalScore}</span>
              )}
            </div>
            {onRemovePlayer ? (
              <button
                type="button"
                aria-label={`Remove ${player.username}`}
                className="ml-auto self-center rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-700"
                onClick={() => onRemovePlayer(player.id)}
              >
                Remove
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default PlayerList;

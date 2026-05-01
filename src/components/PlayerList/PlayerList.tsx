import { AvatarImage } from "@/components/AvatarImage/AvatarImage";
import { Player } from "@/domain/game/gameTypes";
import { AvatarId, avatarSet } from "@/components/Form/AddPlayer/AddPlayer";

type PlayerListProps = {
  activePlayerId?: string;
  leadingPlayerId?: string | null;
  onRemovePlayer?: (playerId: string) => void;
  players: Player[];
  targetScore?: number;
};

function PlayerList({
  activePlayerId,
  leadingPlayerId,
  onRemovePlayer,
  players = [],
  targetScore,
}: Readonly<PlayerListProps>) {
  return (
    <ul className="player-list | flex flex-col gap-2">
      {players.map((player) => {
        const isActive = player.id === activePlayerId;
        const isLeader = player.id === leadingPlayerId;
        const totalScore = player.totalScore ?? 0;
        const remainingScore =
          targetScore && targetScore > 0
            ? Math.max(0, targetScore - totalScore)
            : null;
        const progress =
          targetScore && targetScore > 0
            ? Math.min(100, Math.round((totalScore / targetScore) * 100))
            : null;
        const classes = `flex gap-3 bg-gray-700 border border-pink-200 text-white p-4 rounded-2xl ${
          isActive ? "border-pink-500 bg-pink-900" : "hover:bg-gray-600"
        }`;
        const avatar = avatarSet[player.avatar as AvatarId];

        return (
          <li key={player.id} aria-current={isActive ? "step" : undefined}>
            <div className={classes}>
              <div
                className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-2 p-2 ring ${avatar.color} `}
              >
                <AvatarImage
                  avatar={avatar}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex min-w-0 items-baseline gap-2">
                  <p className="font-heading-2 truncate">{player.username}</p>
                  {isActive ? (
                    <span className="rounded-full bg-pink-500 px-2 py-1 text-xs text-white">
                      Current
                    </span>
                  ) : null}
                  {isLeader && totalScore > 0 ? (
                    <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs text-gray-900">
                      Leader
                    </span>
                  ) : null}
                </div>
                <span className="block text-pink-300">
                  {totalScore} points
                  {/* {remainingScore === null
                    ? null
                    : ` - needs ${remainingScore}`} */}
                </span>
                {progress !== null ? (
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-white"
                    aria-label={`${player.username} is ${progress}% of the way to the target score`}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full bg-pink-500 transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : null}
              </div>
              {onRemovePlayer ? (
                <button
                  type="button"
                  aria-label={`Remove ${player.username}`}
                  className="ml-auto self-center cursor-pointer rounded-lg px-3 py-2 text-sm text-pink-300 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-yellow-500"
                  onClick={() => onRemovePlayer(player.id)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default PlayerList;

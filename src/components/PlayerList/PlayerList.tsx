import { AvatarId, avatarSet } from '@/domain/game/avatars';
import { Player } from '@/domain/game/gameTypes';
import { AvatarImage } from '@/components/AvatarImage/AvatarImage';

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
    <ul className="player-list | flex flex-col gap-xs">
      {players.map((player) => {
        const isActive = player.id === activePlayerId;
        const isLeader = player.id === leadingPlayerId;
        const totalScore = player.totalScore ?? 0;
        const progress =
          targetScore && targetScore > 0
            ? Math.min(100, Math.round((totalScore / targetScore) * 100))
            : null;
        const classes = `flex gap-sm bg-surface-raised border border-border text-text p-md rounded-2xl ${
          isActive ? 'border-accent bg-surface-muted' : 'hover:bg-surface-muted'
        }`;
        const avatar = avatarSet[player.avatar as AvatarId];

        return (
          <li
            key={player.id}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className={classes}>
              <div
                className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-2 p-xs ring ${avatar.color} `}
              >
                <AvatarImage
                  avatar={avatar}
                  alt={`${player.username}'s ${avatar.name} avatar`}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2xs">
                <div className="grid min-w-0 gap-xs">
                  <p
                    className="font-heading-2 truncate"
                    title={player.username}
                  >
                    {player.username}
                  </p>
                  {isActive || (isLeader && totalScore > 0) ? (
                    <div className="flex flex-wrap gap-2xs">
                      {isActive ? (
                        <span className="rounded-full bg-accent px-xs py-2xs text-xs text-accent-contrast">
                          Current
                        </span>
                      ) : null}
                      {isLeader && totalScore > 0 ? (
                        <span className="rounded-full bg-control px-xs py-2xs text-xs text-control-text">
                          Leader
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <span className="block text-text-muted">{totalScore} points</span>
                {progress === null ? null : (
                  <div
                    className="h-2 overflow-hidden rounded-full bg-surface"
                    aria-label={`${player.username} is ${progress}% of the way to the target score`}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full bg-accent transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              {onRemovePlayer ? (
                <button
                  type="button"
                  aria-label={`Remove ${player.username}`}
                  className="ml-auto self-center cursor-pointer rounded-lg px-sm py-xs text-sm text-text-muted hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
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

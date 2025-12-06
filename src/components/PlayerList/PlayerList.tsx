import { Player } from "@/domain/game/gameTypes";

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
        const classes = `flex p-2 gap-3 ${player.playerId === activePlayerId ? "border-l-4 border-red-300 bg-amber-100 hover:bg-amber-50" : "bg-gray-50 : hover:bg-gray-100"}`;
        return (
          <li key={player.id} className={classes}>
            <img
              src={`/avatar/${player.avatar}.svg`}
              className="w-[60px] border-4 rounded-sm border-white ring"
              alt="The user's selected avatar of a playful illustration"
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-body">
                {player.username} - {player.playerId}
              </h3>
              {!!player.totalScore && (
                <span className="block text-amber-600">
                  {player.totalScore}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default PlayerList;

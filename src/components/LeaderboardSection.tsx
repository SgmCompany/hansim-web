import Link from 'next/link';

type LeaderboardPlayer = {
  rank: number;
  name: string;
  tier: string;
  lp: number;
  score: number;
  avatarUrl: string;
};

type LeaderboardSectionProps = {
  players: LeaderboardPlayer[];
};

export function LeaderboardSection({ players }: LeaderboardSectionProps) {
  return (
    <div className="flex justify-center w-full min-w-0">
      <div className="w-full max-w-4xl rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4 sm:p-6 lg:p-10 shadow-sm no-line-boundary">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="min-w-0 pr-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-1">한심왕</h3>
            <p className="text-on-surface-variant text-xs sm:text-sm leading-snug">
              관심 유저 기준 최고의 한심한 소환사
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {players.map((player) => (
            <Link
              key={player.rank}
              href={`/summoner/${encodeURIComponent(player.name)}`}
              className={`flex items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer group transition-all min-h-[4.5rem] ${
                player.rank === 1
                  ? 'bg-primary-container/30 hover:bg-primary-container/50'
                  : 'hover:bg-surface-container'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center font-black text-lg sm:text-xl ${
                  player.rank === 1
                    ? 'bg-primary text-on-primary shadow-inner'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {player.rank}
              </div>

              <img
                src={player.avatarUrl}
                alt={`${player.name} avatar`}
                className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-lg object-cover"
              />

              <div className="grow min-w-0">
                <h4 className="text-base sm:text-lg font-bold truncate">{player.name}</h4>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      player.rank === 1
                        ? 'bg-white/50 text-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {player.tier}
                  </span>
                  <span className="text-sm font-bold text-on-surface-variant">
                    {player.lp.toLocaleString()} LP
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-lg sm:text-2xl font-black tracking-tighter ${
                    player.rank === 1 ? 'text-primary' : 'text-on-background'
                  }`}
                >
                  {player.score}
                </div>
                <div className="text-[10px] font-black text-outline uppercase tracking-widest">
                  Score
                </div>
              </div>

              <span className="material-symbols-outlined text-primary opacity-30 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 text-xl">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

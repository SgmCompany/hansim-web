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
    <div className="flex justify-center">
      <div className="w-full max-w-4xl bg-surface-container-lowest p-10 hansim-card no-line-boundary">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-1">한심왕</h3>
            <p className="text-on-surface-variant text-sm">관심 유저 기준 최고의 한심한 소환사</p>
          </div>
        </div>

        <div className="space-y-6">
          {players.map((player) => (
            <Link
              key={player.rank}
              href={`/summoner/${encodeURIComponent(player.name)}`}
              className={`flex items-center gap-6 p-4 rounded-3xl cursor-pointer group transition-all ${
                player.rank === 1
                  ? 'bg-primary-container/30 hover:bg-primary-container/50'
                  : 'hover:bg-surface-container'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
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
                className="w-16 h-16 rounded-2xl object-cover"
              />

              <div className="flex-grow">
                <h4 className="text-lg font-bold">{player.name}</h4>
                <div className="flex items-center gap-3">
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

              <div className="text-right">
                <div
                  className={`text-2xl font-black tracking-tighter ${
                    player.rank === 1 ? 'text-primary' : 'text-on-background'
                  }`}
                >
                  {player.score}
                </div>
                <div className="text-[10px] font-black text-outline uppercase tracking-widest">
                  Score
                </div>
              </div>

              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

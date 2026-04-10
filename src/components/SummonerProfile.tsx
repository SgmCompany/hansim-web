type SummonerProfileProps = {
  summoner: {
    name: string;
    level: number;
    region: string;
    rank: number;
    percentile: number;
    avatarUrl: string;
    tier: string;
    lp: number;
    topPercent: number;
    winStreak: number;
  };
};

export function SummonerProfile({ summoner }: SummonerProfileProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div className="flex items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-xl bg-surface-container-lowest p-1 shadow-sm overflow-hidden">
            <img
              src={summoner.avatarUrl}
              alt={`${summoner.name} avatar`}
              className="w-full h-full rounded-[2.5rem] bg-secondary-container object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-xs font-black px-3 py-1 rounded-full ring-4 ring-surface">
            LV. {summoner.level}
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tight text-on-surface">{summoner.name}</h1>
          <p className="text-on-surface-variant font-semibold flex items-center gap-2">
            <span className="text-primary-dim">{summoner.region}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span>
              래더 랭킹 {summoner.rank.toLocaleString()}위 (상위 {summoner.percentile}%)
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 bg-surface-container-lowest px-6 py-3 rounded-full font-bold shadow-sm hover:bg-surface-container-low transition-colors text-on-surface self-start md:self-auto"
      >
        <span className="material-symbols-outlined text-primary">calendar_today</span>
        최근 1주일
        <span className="material-symbols-outlined text-outline">expand_more</span>
      </button>
    </header>
  );
}

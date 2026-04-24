type StatsGridProps = {
  stats: {
    winRate: number;
    wins: number;
    losses: number;
    tier: string;
    lp: number;
    winStreak: number;
    kda: string;
    kdaDetail: string;
    killParticipation: number;
    csPerMin: number;
    avgCs: number;
    visionScore: number;
    wardsPerMin: number;
    controlWards: number;
  };
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      {/* Win Rate Circular Card */}
      <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm h-full">
        <h3 className="text-sm font-bold text-on-surface-variant mb-6 tracking-widest uppercase">
          승률
        </h3>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              className="text-surface-container-low"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeWidth="14"
            ></circle>
            <circle
              className="text-primary"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeDasharray="439.8"
              strokeDashoffset={439.8 * (1 - stats.winRate / 100)}
              strokeLinecap="round"
              strokeWidth="14"
            ></circle>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-on-surface">{stats.winRate}%</span>
            <span className="text-xs font-bold text-on-surface-variant">
              {stats.wins}승 {stats.losses}패
            </span>
          </div>
        </div>
      </div>
        {/* KDA Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 flex flex-col shadow-sm h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined filled">
                swords
              </span>
            </div>
            <span className="font-black text-on-surface">KDA</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-primary">{stats.kda}</span>
            <span className="text-on-surface-variant font-bold text-sm">평균</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm">{stats.kdaDetail}</p>
          <div className="flex-1"></div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">킬 관여율</span>
              <span className="text-sm font-black text-on-surface">{stats.killParticipation}%</span>
            </div>
          </div>
        </div>

        {/* CS/Min Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 flex flex-col shadow-sm h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined filled">
                grass
              </span>
            </div>
            <span className="font-black text-on-surface">CS/Min</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-on-surface">{stats.csPerMin}</span>
            <span className="text-on-surface-variant font-bold text-sm">개/분</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm mb-2">총 CS 평균 {stats.avgCs}개</p>
          <div className="flex-1"></div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15 opacity-0">
            <div className="h-5"></div>
          </div>
        </div>

        {/* Vision Score Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 flex flex-col shadow-sm h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined filled">
                visibility
              </span>
            </div>
            <span className="font-black text-on-surface">시야 점수</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-on-surface">{stats.visionScore}</span>
            <span className="text-on-surface-variant font-bold text-sm">점</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm">
            분당 와드 설치 {stats.wardsPerMin}개
          </p>
          <div className="flex-1"></div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">제어 와드 구매</span>
              <span className="text-sm font-black text-on-surface">평균 {stats.controlWards}개</span>
            </div>
          </div>
        </div>
    </div>
  );
}

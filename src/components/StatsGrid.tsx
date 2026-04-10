type StatsGridProps = {
  stats: {
    winRate: number;
    wins: number;
    losses: number;
    tier: string;
    lp: number;
    topPercent: number;
    winStreak: number;
    kda: string;
    kdaDetail: string;
    killParticipation: number;
    csPerMin: number;
    avgCs: number;
    csRank: number;
    visionScore: number;
    wardsPerMin: number;
    controlWards: number;
  };
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Win Rate Circular Card */}
      <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
        <h3 className="text-sm font-bold text-on-surface-variant mb-6 tracking-widest uppercase">
          시즌 승률
        </h3>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              className="text-surface-container-low"
              cx="96"
              cy="96"
              fill="transparent"
              r="80"
              stroke="currentColor"
              strokeWidth="16"
            ></circle>
            <circle
              className="text-primary"
              cx="96"
              cy="96"
              fill="transparent"
              r="80"
              stroke="currentColor"
              strokeDasharray="502.6"
              strokeDashoffset={502.6 * (1 - stats.winRate / 100)}
              strokeLinecap="round"
              strokeWidth="16"
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

      {/* Solo Rank Status Card */}
      <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col sm:flex-row items-center gap-10 shadow-sm">
        <div className="w-40 h-40 flex items-center justify-center shrink-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_8F_n4BEOUE_DfKfl7lnrnzxnulOqEo2NR5QQP_qsq5XhOwTFtjdIfzYsDcWb7pA7WypjGJ9VwHYQOaRpYmZnzofluOieghzSmkKU8HGv5GnseRxaOylJj7DsamSB_hSyJjKHdD8flCjg7xtUrh3ScxhrmS0U0XmGEz75gvGt4q4FCbmHgRfS5GXXo0ByvfMTRjwVjmzdnwiVj20ROVfrs-8Ug_tAXCgN7-vc-SsAqRHzFWBbWuTq9XwgrpwMtctcUL2-bm8pGc"
            alt={`${stats.tier} Rank`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary font-black tracking-widest text-xs uppercase">
              솔로 랭크
            </span>
            <span className="text-on-surface-variant text-sm font-bold">{stats.tier}</span>
          </div>
          <h2 className="text-4xl font-black text-on-surface mb-2">{stats.lp} LP</h2>
          <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-primary to-primary-dim w-3/4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-2xl p-4">
              <p className="text-xs font-bold text-on-surface-variant mb-1">상위</p>
              <p className="text-lg font-black text-primary">{stats.topPercent}%</p>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4">
              <p className="text-xs font-bold text-on-surface-variant mb-1">연승</p>
              <p className="text-lg font-black text-secondary">{stats.winStreak}연승 중</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Detailed Stats */}
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KDA Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between shadow-sm">
          <div>
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
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">킬 관여율</span>
              <span className="text-sm font-black text-on-surface">{stats.killParticipation}%</span>
            </div>
          </div>
        </div>

        {/* CS/Min Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between shadow-sm">
          <div>
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
            <p className="text-on-surface-variant font-medium text-sm">총 CS 평균 {stats.avgCs}개</p>
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">전체 플레이어 대비</span>
              <span className="text-sm font-black text-primary">상위 {stats.csRank}%</span>
            </div>
          </div>
        </div>

        {/* Vision Score Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between shadow-sm">
          <div>
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
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/15">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">제어 와드 구매</span>
              <span className="text-sm font-black text-on-surface">평균 {stats.controlWards}개</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

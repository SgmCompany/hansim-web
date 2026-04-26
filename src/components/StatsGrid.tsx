type StatsGridProps = {
  layout?: 'default' | 'compact';
  stats: {
    winRate: number;
    wins: number;
    losses: number;
    tier: string;
    lp: number;
    winStreak: number;
    kda: string;
    kdaDetail?: string | null;
    killParticipation?: number | null;
    csPerMin: number;
    visionScore: number;
    avgDamage: number;
  };
};

function formatDamage(n: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(n));
}

export function StatsGrid({ stats, layout = 'default' }: StatsGridProps) {
  const compact = layout === 'compact';
  const kdaDetailText = stats.kdaDetail?.trim() ? stats.kdaDetail : '—';
  const kpText =
    stats.killParticipation != null && Number.isFinite(stats.killParticipation)
      ? `${stats.killParticipation}%`
      : '—';

  const cardBase = compact
    ? 'summoner-stat-card bg-surface-container-lowest flex flex-col shadow-sm'
    : 'bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col shadow-sm min-h-[9.5rem] sm:min-h-0';

  const winCardExtra = compact
    ? 'items-center justify-center text-center'
    : 'items-center justify-center text-center min-h-[9.5rem] sm:min-h-0';

  const titleCls = compact
    ? 'summoner-stat-label font-bold text-on-surface-variant tracking-wide'
    : 'text-[0.7rem] sm:text-xs font-bold text-on-surface-variant mb-3 tracking-wide';

  const valueCls = compact
    ? 'summoner-stat-value font-black text-on-surface tabular-nums leading-none'
    : 'text-3xl sm:text-4xl font-black text-on-surface tabular-nums leading-none';

  const primaryValueCls = compact
    ? 'summoner-stat-value font-black text-primary tabular-nums leading-none'
    : 'text-3xl sm:text-4xl font-black text-primary tabular-nums leading-none';

  const subCls = compact
    ? 'summoner-stat-sub text-on-surface-variant font-medium mt-1.5 line-clamp-2 min-h-[2.5rem]'
    : 'text-on-surface-variant font-medium text-xs sm:text-sm mt-1.5 line-clamp-2 min-h-[2.5rem]';

  const hintCls = compact
    ? 'summoner-stat-meta text-on-surface-variant font-medium mt-2'
    : 'text-on-surface-variant text-[0.7rem] sm:text-xs font-medium mt-2';

  const wlCls = compact
    ? 'summoner-stat-meta font-bold text-on-surface-variant mt-1 tabular-nums'
    : 'text-[0.7rem] sm:text-xs font-bold text-on-surface-variant mt-1 tabular-nums';

  const metaRowLabel = compact
    ? 'summoner-stat-meta font-bold text-on-surface-variant shrink-0'
    : 'text-[0.7rem] sm:text-xs font-bold text-on-surface-variant shrink-0';

  const metaRowVal = compact
    ? 'summoner-stat-meta font-black text-on-surface tabular-nums'
    : 'text-xs sm:text-sm font-black text-on-surface tabular-nums';

  const iconWrap = compact
    ? 'summoner-stat-icon-wrap rounded-full flex items-center justify-center shrink-0'
    : 'w-9 h-9 rounded-full flex items-center justify-center shrink-0';

  const iconPrimary = compact
    ? `${iconWrap} bg-primary-container text-primary`
    : 'w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0';
  const iconSecondary = compact
    ? `${iconWrap} bg-secondary-container text-secondary`
    : 'w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0';
  const iconTertiary = compact
    ? `${iconWrap} bg-tertiary-container text-tertiary`
    : 'w-9 h-9 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shrink-0';
  const iconError = compact
    ? `${iconWrap} bg-error-container summoner-stat-icon-error`
    : 'w-9 h-9 rounded-full bg-error-container flex items-center justify-center text-on-error-container shrink-0';

  const donutWrap = compact
    ? 'summoner-stat-donut relative flex items-center justify-center shrink-0'
    : 'relative w-[7.25rem] h-[7.25rem] sm:w-36 sm:h-36 flex items-center justify-center shrink-0';

  const gridCls = compact
    ? 'summoner-stat-grid grid'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-3 sm:mb-4';

  const statTitleCls = compact
    ? 'font-black text-on-surface text-sm'
    : 'font-black text-on-surface text-sm sm:text-base';

  return (
    <div className={gridCls}>
      <div className={`${cardBase} ${winCardExtra}`}>
        <h3 className={compact ? `${titleCls} mb-1 text-center w-full` : titleCls}>승률</h3>
        <div className={compact ? `${donutWrap} mt-2` : donutWrap}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160" aria-hidden>
            <circle
              className="text-surface-container-low"
              cx="80"
              cy="80"
              fill="transparent"
              r="70"
              stroke="currentColor"
              strokeWidth="14"
            />
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
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={compact ? 'summoner-winrate-percent text-on-surface tabular-nums' : valueCls}>
              {stats.winRate}%
            </span>
            <span className={wlCls}>
              {stats.wins}승 {stats.losses}패
            </span>
          </div>
        </div>
      </div>

      <div className={`${cardBase} min-h-[9.5rem]`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconPrimary}>
            <span className="material-symbols-outlined filled text-[1.25rem]">swords</span>
          </div>
          <span className={statTitleCls}>KDA</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={primaryValueCls}>{stats.kda}</span>
        </div>
        <p className={subCls}>{kdaDetailText}</p>
        <div className="flex-1 min-h-2" />
        <div className="pt-3 mt-auto border-t border-outline-variant/15 flex justify-between items-center gap-2">
          <span className={metaRowLabel}>킬관여</span>
          <span className={metaRowVal}>{kpText}</span>
        </div>
      </div>

      <div className={`${cardBase} min-h-[9.5rem]`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconSecondary}>
            <span className="material-symbols-outlined filled text-[1.25rem]">grass</span>
          </div>
          <span className={statTitleCls}>CS/분</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={valueCls}>{stats.csPerMin.toFixed(1)}</span>
        </div>
        <p className={hintCls}>대표 큐·분당</p>
        <div className="flex-1" />
      </div>

      <div className={`${cardBase} min-h-[9.5rem]`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconTertiary}>
            <span className="material-symbols-outlined filled text-[1.25rem]">visibility</span>
          </div>
          <span className={statTitleCls}>시야</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={valueCls}>{stats.visionScore.toFixed(1)}</span>
        </div>
        <p className={hintCls}>평균 비전</p>
        <div className="flex-1" />
      </div>

      <div
        className={`${cardBase} min-h-[9.5rem]${compact ? '' : ' sm:col-span-2 lg:col-span-1 xl:col-span-1'}`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconError}>
            <span className="material-symbols-outlined filled text-[1.25rem]">whatshot</span>
          </div>
          <span className={statTitleCls}>딜</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`${valueCls} break-all`}>{formatDamage(stats.avgDamage)}</span>
        </div>
        <p className={hintCls}>평균 피해량/판</p>
        <div className="flex-1" />
      </div>
    </div>
  );
}

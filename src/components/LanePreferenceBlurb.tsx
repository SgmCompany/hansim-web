import type { LanePreferenceSummary } from '@/src/utils/lanePreference';

type LanePreferenceBlurbProps = {
  summary: LanePreferenceSummary | null | undefined;
  /** 요약 카드 등 더 작은 타이포 */
  compact?: boolean;
  className?: string;
};

export function LanePreferenceBlurb({ summary, compact, className = '' }: LanePreferenceBlurbProps) {
  if (!summary) return null;

  const pct = Math.round(summary.ratio * 100);

  return (
    <div
      className={`flex items-start gap-2 ${compact ? 'mb-1.5' : 'mb-2'} ${className}`.trim()}
    >
      <span
        className="material-symbols-outlined text-primary shrink-0 mt-0.5"
        style={{ fontSize: compact ? '1.125rem' : '1.25rem' }}
        aria-hidden
      >
        route
      </span>
      <div className="min-w-0">
        <p className={`${compact ? 'text-xs' : 'text-sm'} leading-snug`}>
          <span className="font-black text-on-surface">통계 주 라인</span>
          <span className="font-bold text-on-surface-variant"> · {summary.primaryLabel}</span>
          <span className="font-bold text-primary tabular-nums"> · {pct}%</span>
        </p>
        <p className="text-[0.65rem] sm:text-xs text-on-surface-variant font-medium mt-0.5 leading-snug">
          상위 챔피언 {summary.totalGames}판 중 {summary.gamesOnPrimary}판
        </p>
      </div>
    </div>
  );
}

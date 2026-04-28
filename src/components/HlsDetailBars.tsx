import type { components } from '@/src/types/api.generated';
import { getHlsDetailRowViews } from '@/src/utils/hlsDetailPresentation';

type HlsDetail = components['schemas']['HlsDetail'];

type Props = {
  detail: HlsDetail | undefined;
  className?: string;
};

const BAR_SEGMENTS = 10;

export function HlsDetailBars({ detail, className = '' }: Props) {
  const rows = getHlsDetailRowViews(detail);
  const hasAny = rows.some((r) => r.score > 0);

  if (!hasAny) {
    return null;
  }

  return (
    <section
      className={`rounded-xl border border-outline-variant/15 bg-surface-container-low/60 p-3 sm:p-4 ${className}`.trim()}
      aria-labelledby="hls-detail-bars-heading"
    >
      <h3
        id="hls-detail-bars-heading"
        className="text-xs sm:text-sm font-black text-on-surface mb-3 flex items-center gap-1.5"
      >
        <span aria-hidden>📊</span>
        오늘의 한심 분석
      </h3>
      <ul className="space-y-2.5 min-w-0">
        {rows.map((row) => (
          <li key={row.key} className="min-w-0 grid grid-cols-[auto_1fr_auto] gap-x-2 sm:gap-x-3 items-center text-[0.7rem] sm:text-xs">
            <span className="shrink-0 w-22 sm:w-28 flex items-center gap-1 text-on-surface-variant font-bold truncate" title={row.label}>
              <span aria-hidden>{row.emoji}</span>
              <span className="truncate">{row.label}</span>
            </span>
            <div
              className="grid grid-cols-10 gap-0.5 min-w-0 h-2"
              role="img"
              aria-label={`${row.label} ${row.score}점 만점 ${row.max} 중`}
            >
              {Array.from({ length: BAR_SEGMENTS }, (_, i) => {
                const filled = Math.min(
                  BAR_SEGMENTS,
                  Math.round((row.score / row.max) * BAR_SEGMENTS),
                );
                const on = i < filled;
                return (
                  <span
                    key={i}
                    className={`rounded-sm min-w-0 ${on ? 'bg-primary' : 'bg-outline-variant/25'}`}
                  />
                );
              })}
            </div>
            <span className="shrink-0 font-black tabular-nums text-on-surface text-right w-12 sm:w-14">
              {row.score}/{row.max}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

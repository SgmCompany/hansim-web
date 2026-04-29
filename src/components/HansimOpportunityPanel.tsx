import type { components } from '@/src/types/api.generated';
import { HLS_TITLE_TOOLTIP } from '@/src/constants/hlsNaming';
import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';
import { getHlsTier } from '@/src/constants/hlsTier';
import { HansimOpportunityFootnote } from '@/src/components/HansimOpportunityFootnote';
import { HlsDetailBars } from '@/src/components/HlsDetailBars';
import { getHansimOpportunityDisplay } from '@/src/utils/hansimOpportunityDisplay';
import { getHlsHighlightQuips } from '@/src/utils/hlsHighlightQuips';

type Player = components['schemas']['Player'];

type Props = {
  player: Player;
  className?: string;
  variant?: 'default' | 'compact';
  showFootnote?: boolean;
};

const wonFmt = new Intl.NumberFormat('ko-KR');

export function HansimOpportunityPanel({
  player,
  className = '',
  variant = 'default',
  showFootnote: showFootnoteProp,
}: Props) {
  const showFootnote = showFootnoteProp ?? variant === 'default';
  const d = getHansimOpportunityDisplay(player);
  const tier =
    d.hlsTotal != null ? getHlsTier(d.hlsTotal) : null;
  const highlightLines = getHlsHighlightQuips(player.hls?.detail);

  if (variant === 'compact') {
    return (
      <div
        className={`rounded-sm bg-surface-container/90 border border-outline-variant/15 px-2.5 py-2 sm:px-3 sm:py-2.5 ${className}`.trim()}
        role="region"
        aria-label="한심지수·플레이·최저시급 환산"
      >
        {tier ? (
          <p className="text-[0.7rem] sm:text-xs text-on-surface leading-snug mb-2 pb-2 border-b border-outline-variant/10">
            <span className="text-base sm:text-lg mr-1" aria-hidden>
              {tier.emoji}
            </span>
            <span className="font-black text-on-surface">{tier.label}</span>
            <span className="text-on-surface-variant font-medium"> — {tier.quote}</span>
          </p>
        ) : null}
        <dl className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-[0.72rem] sm:text-sm">
          {d.hlsTotal != null ? (
            <div className="flex items-baseline gap-1 shrink-0">
              <dt className="font-bold text-on-surface-variant">
                <abbr title={HLS_TITLE_TOOLTIP} className="cursor-help decoration-dotted underline-offset-2">
                  HLS
                </abbr>
              </dt>
              <dd className="font-black tabular-nums text-error text-base sm:text-lg leading-none">
                {d.hlsTotal}
              </dd>
            </div>
          ) : null}
          <div className="flex items-baseline gap-1 min-w-0">
            <dt className="font-bold text-on-surface-variant shrink-0">플레이</dt>
            <dd className="font-black tabular-nums text-on-surface truncate">{d.playDurationLabel}</dd>
          </div>
          <div className="flex items-baseline gap-1 flex-wrap sm:ml-auto sm:text-right">
            <dt className="font-medium text-on-surface-variant">환산</dt>
            <dd>
              <span className="text-on-surface-variant font-medium">
                {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원/시 기준{' '}
              </span>
              <span className="font-black text-primary tabular-nums">
                약 {wonFmt.format(d.opportunityWon)}원
              </span>
            </dd>
          </div>
        </dl>
        {showFootnote ? (
          <HansimOpportunityFootnote className="mt-2 border-t border-outline-variant/15 pt-2" />
        ) : null}
      </div>
    );
  }

  return (
    <section
      className={`rounded-sm bg-surface-container border border-outline-variant/20 p-4 sm:p-5 space-y-4 ${className}`.trim()}
      aria-label="한심지수 및 플레이 시간 기회비용"
    >
      {/* 1. 총점 + 등급 + 등급 멘트 */}
      {d.hlsTotal != null && tier ? (
        <header className="flex flex-col gap-1.5 pb-4 border-b border-outline-variant/20">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="text-[0.72rem] font-bold text-on-surface-variant uppercase tracking-wide">
              <abbr title={HLS_TITLE_TOOLTIP} className="cursor-help decoration-dotted underline-offset-2">
                HLS
              </abbr>{' '}
              총점
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-black text-4xl sm:text-5xl text-error tabular-nums leading-none">
                {d.hlsTotal}
              </span>
              <span className="text-on-surface-variant text-sm tabular-nums">/ 100</span>
              <span className="text-2xl sm:text-3xl" aria-hidden>
                {tier.emoji}
              </span>
              <span className="font-black text-lg sm:text-xl text-on-surface">{tier.label}</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-on-surface font-medium leading-relaxed pl-0.5">
            「{tier.quote}」
          </p>
        </header>
      ) : (
        <p className="text-sm text-on-surface-variant">한심 총점 정보가 없습니다.</p>
      )}

      {/* 2. 부분 점수 막대 */}
      <HlsDetailBars detail={player.hls?.detail} />

      {/* 3. 핵심 요인 멘트 */}
      {highlightLines.length > 0 ? (
        <div className="space-y-2" role="status" aria-live="polite">
          <p className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wide">
            핵심 요인 한마디
          </p>
          <ul className="space-y-2">
            {highlightLines.map((line, i) => (
              <li
                key={i}
                className="text-sm sm:text-base text-on-surface leading-snug flex gap-2 pl-1 border-l-2 border-primary/40 bg-primary/5 rounded-r-sm py-2 pr-3"
              >
                <span className="shrink-0" aria-hidden>
                  💬
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 4. 플레이 + 최저임금 환산 */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 pt-3 border-t border-outline-variant/15 text-sm">
        <p className="text-on-surface leading-snug">
          <span className="font-bold text-on-surface-variant">플레이 </span>
          <span className="font-black tabular-nums">{d.playDurationLabel}</span>
        </p>
        <span className="hidden sm:inline text-outline-variant mx-1" aria-hidden>
          ·
        </span>
        <p className="text-on-surface leading-snug sm:ml-auto sm:text-right">
          <span className="text-on-surface-variant font-medium">
            같은 시간 최저시급({wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원/시) 약{' '}
          </span>
          <span className="font-black text-primary tabular-nums">{wonFmt.format(d.opportunityWon)}원</span>
        </p>
      </div>

      {showFootnote ? <HansimOpportunityFootnote /> : null}
    </section>
  );
}

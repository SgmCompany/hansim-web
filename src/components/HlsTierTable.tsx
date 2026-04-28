'use client';

import { useState } from 'react';
import { getHlsDataSignalEntries, HLS_SCORE_MODEL } from '@/src/constants/hlsDataSignals';
import { HLS_TIERS, formatHlsScoreRange, type HlsTierDef } from '@/src/constants/hlsTier';

type Variant = 'full' | 'compact' | 'sidebar';

type Props = {
  variant?: Variant;
  className?: string;
  /** `compact` 전용 · `full`·`sidebar`에서는 무시 */
  collapsible?: boolean;
  /** `collapsible`일 때 초기 펼침 상태 (홈: true 권장) */
  defaultOpen?: boolean;
};

function TierRowDesktop({ row }: { row: HlsTierDef }) {
  return (
    <tr className="border-b border-outline-variant/15 last:border-0 hover:bg-surface-container/50 transition-colors">
      <td className="py-2.5 sm:py-3 px-2 sm:px-3 font-black tabular-nums text-on-surface text-sm sm:text-base whitespace-nowrap">
        {formatHlsScoreRange(row)}
      </td>
      <td className="py-2.5 sm:py-3 px-2 sm:px-3">
        <span className="text-lg sm:text-xl mr-1.5" aria-hidden>
          {row.emoji}
        </span>
        <span className="font-black text-on-surface text-sm sm:text-base">{row.label}</span>
      </td>
      <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-on-surface-variant text-xs sm:text-sm leading-snug">
        {row.quote}
      </td>
    </tr>
  );
}

function TierCardMobile({ row }: { row: HlsTierDef }) {
  return (
    <div className="rounded-lg border border-outline-variant/15 bg-surface-container/40 p-3 sm:p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="font-black tabular-nums text-on-surface">{formatHlsScoreRange(row)}</span>
        <span className="text-xl shrink-0" aria-hidden>
          {row.emoji}
        </span>
      </div>
      <p className="font-black text-on-surface text-sm mb-1">{row.label}</p>
      <p className="text-on-surface-variant text-xs leading-relaxed">{row.quote}</p>
    </div>
  );
}

function HlsDataSignalsBlock({ dense }: { dense?: boolean }) {
  const items = getHlsDataSignalEntries();

  return (
    <section
      className={`rounded-lg border border-outline-variant/15 bg-surface-container/35 ${dense ? 'p-3 sm:p-4 mb-0' : 'p-4 sm:p-5 mb-0'}`}
      aria-labelledby="hls-data-signals-heading"
    >
      <h4
        id="hls-data-signals-heading"
        className={`font-black text-on-surface mb-1 ${dense ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
      >
        무엇을 보고 계산하나요?
      </h4>
      <p
        className={`text-on-surface-variant leading-relaxed mb-4 ${dense ? 'text-[0.7rem] sm:text-xs' : 'text-xs sm:text-sm'}`}
      >
        총점 모델은 <strong className="font-bold text-on-surface">{HLS_SCORE_MODEL}</strong>입니다.
        원천 데이터는 <strong className="font-bold text-on-surface">Riot 제공 매치</strong>에서
        가져오며, 부분 점수 상한 등은 서버 산식에 따라 최종 HLS가 정해집니다.
      </p>
      <ul className={`space-y-3 ${dense ? 'text-[0.7rem] sm:text-xs' : 'text-xs sm:text-sm'}`}>
        {items.map((item) => (
          <li key={item.label} className="flex gap-2.5 leading-snug">
            <span className="shrink-0" aria-hidden>
              {item.emoji}
            </span>
            <span>
              <strong className="font-bold text-on-surface">{item.label}</strong>
              <span className="text-on-surface-variant"> — {item.hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HlsTierTable({
  variant = 'full',
  className = '',
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [detailsOpen, setDetailsOpen] = useState(collapsible ? defaultOpen : false);

  if (variant === 'sidebar') {
    return (
      <div
        className={`rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-3 shadow-sm ${className}`.trim()}
        role="region"
        aria-labelledby="hls-sidebar-heading"
      >
        <h3
          id="hls-sidebar-heading"
          className="text-xs font-black text-on-surface mb-1.5 leading-tight"
        >
          한심지수 등급
        </h3>
        <p className="text-[0.6rem] text-on-surface-variant leading-snug mb-2.5">
          0~100 · 높을수록 한심↑ — 행에 포인터를 올리면 멘트 예시를 볼 수 있어요.
        </p>
        <div className="rounded-md border border-outline-variant/20 overflow-hidden max-h-[min(70vh,28rem)] overflow-y-auto overscroll-y-contain">
          <table className="w-full text-[0.65rem] text-left border-collapse">
            <caption className="sr-only">HLS 구간별 등급 요약</caption>
            <thead>
              <tr className="bg-surface-container-high/80 text-on-surface-variant font-bold">
                <th scope="col" className="py-1.5 px-1.5 w-[30%]">
                  HLS
                </th>
                <th scope="col" className="py-1.5 px-1.5">
                  등급
                </th>
              </tr>
            </thead>
            <tbody>
              {HLS_TIERS.map((row) => (
                <tr
                  key={`${row.min}-${row.max}`}
                  className="border-t border-outline-variant/12 hover:bg-surface-container/60 transition-colors"
                  title={`멘트 예시: ${row.quote}`}
                >
                  <td className="py-1.5 px-1.5 font-black tabular-nums text-on-surface align-top whitespace-nowrap">
                    {formatHlsScoreRange(row)}
                  </td>
                  <td className="py-1.5 px-1.5 text-on-surface align-top">
                    <span className="mr-0.5" aria-hidden>
                      {row.emoji}
                    </span>
                    <span className="font-bold leading-tight break-words">{row.label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const tierTable = (
    <>
      {variant === 'full' ? (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border border-outline-variant/20">
            <table className="w-full min-w-md text-left border-collapse">
              <caption className="sr-only">한심지수 HLS 점수 구간별 등급과 멘트</caption>
              <thead>
                <tr className="bg-surface-container-high/80 text-[0.65rem] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                  <th scope="col" className="py-2.5 px-3 rounded-tl-lg w-26">
                    HLS
                  </th>
                  <th scope="col" className="py-2.5 px-3 w-36">
                    등급
                  </th>
                  <th scope="col" className="py-2.5 px-3 rounded-tr-lg">
                    멘트 예시
                  </th>
                </tr>
              </thead>
              <tbody>
                {HLS_TIERS.map((row) => (
                  <TierRowDesktop key={`${row.min}-${row.max}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2.5">
            {HLS_TIERS.map((row) => (
              <TierCardMobile key={`${row.min}-${row.max}`} row={row} />
            ))}
          </div>
        </>
      ) : (
        <div className="overflow-x-auto -mx-0.5 px-0.5">
          <table className="w-full min-w-[min(100%,20rem)] text-left text-[0.65rem] sm:text-xs border-collapse">
            <caption className="sr-only">HLS 등급 구간</caption>
            <thead>
              <tr className="text-on-surface-variant font-bold border-b border-outline-variant/20">
                <th scope="col" className="py-1.5 pr-2 whitespace-nowrap">
                  HLS
                </th>
                <th scope="col" className="py-1.5 pr-2">
                  등급
                </th>
                <th scope="col" className="py-1.5">
                  멘트
                </th>
              </tr>
            </thead>
            <tbody>
              {HLS_TIERS.map((row) => (
                <tr
                  key={`${row.min}-${row.max}`}
                  className="border-b border-outline-variant/10 last:border-0"
                >
                  <td className="py-1.5 pr-2 font-black tabular-nums text-on-surface whitespace-nowrap align-top">
                    {formatHlsScoreRange(row)}
                  </td>
                  <td className="py-1.5 pr-2 align-top whitespace-nowrap">
                    <span className="mr-0.5" aria-hidden>
                      {row.emoji}
                    </span>
                    <span className="font-bold text-on-surface">{row.label}</span>
                  </td>
                  <td className="py-1.5 text-on-surface-variant leading-snug align-top">
                    {row.quote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  const intro =
    variant === 'full' ? (
      <div className="mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-black tracking-tight text-on-surface mb-2">
          한심지수 표기 안내
        </h3>
        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
          HLS(HanSim Level Score)는 <strong className="text-on-surface">0~100</strong>점이며,{' '}
          <strong className="text-on-surface">높을수록 한심도가 올라갑니다</strong>. 같은 구간이라도
          플레이 패턴에 따라 멘트는 달라질 수 있어요 — 재미 위한 셀프디스예요.
        </p>
      </div>
    ) : null;

  const shell =
    variant === 'full' ? (
      <div
        className={`w-full max-w-4xl mx-auto rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4 sm:p-6 lg:p-8 shadow-sm no-line-boundary ${className}`.trim()}
      >
        {intro}
        {tierTable}
        <div className="mt-6 sm:mt-8">
          <HlsDataSignalsBlock />
        </div>
      </div>
    ) : collapsible ? (
      <details
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
        className={`group rounded-lg border border-outline-variant/20 bg-surface-container-low/80 no-line-boundary ${className}`.trim()}
      >
        <summary className="list-none cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-black text-on-surface hover:bg-surface-container/40 rounded-lg transition-colors [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2 min-w-0">
            <span aria-hidden>📊</span>
            <span className="truncate">한심지수(HLS) 등급·데이터 기준</span>
          </span>
          <span
            className="material-symbols-outlined text-xl text-on-surface-variant shrink-0 transition-transform group-open:rotate-180"
            aria-hidden
          >
            expand_more
          </span>
        </summary>
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 border-t border-outline-variant/10">
          {tierTable}
          <div className="mt-4 pt-3 border-t border-outline-variant/10">
            <HlsDataSignalsBlock dense />
          </div>
        </div>
      </details>
    ) : (
      <div
        className={`rounded-lg border border-outline-variant/20 bg-surface-container-low/80 px-3 py-2.5 sm:px-4 sm:py-3 no-line-boundary ${className}`.trim()}
      >
        <p className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-wide mb-2">
          HLS 등급 기준
        </p>
        {tierTable}
      </div>
    );

  return shell;
}

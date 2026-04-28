'use client';

import { Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/src/components/Navigation';
import { Footer } from '@/src/components/Footer';
import { SummonerSearchPanel } from '@/src/components/SummonerSearchPanel';
import { formatDateToInput, getToday } from '@/src/utils/date';
import { useBatchSummary } from '@/src/lib/api/hooks/useSummary';
import {
  getTierKoreanName,
  getRankKoreanName,
  getTierColor,
  getProfileIconUrl,
  useLatestVersion,
} from '@/src/lib/ddragon';
import type { components } from '@/src/types/api.generated';
import { MultiKillsInline } from '@/src/components/MultiKillsDisplay';
import { TopChampionsStrip } from '@/src/components/TopChampionsStrip';
import { LanePreferenceBlurb } from '@/src/components/LanePreferenceBlurb';
import { summarizeLaneFromChampions } from '@/src/utils/lanePreference';
import { normalizeSummonerSearchToken } from '@/src/utils/riotId';

type Player = components['schemas']['Player'];

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summoners =
    searchParams
      .get('summoners')
      ?.split(',')
      .map((s) => normalizeSummonerSearchToken(s))
      .filter(Boolean) || [];
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  const [editSearchOpen, setEditSearchOpen] = useState(false);
  const [portalMounted, setPortalMounted] = useState(false);

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    if (!editSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [editSearchOpen]);

  const { data, isLoading, isError, error } = useBatchSummary(summoners, startDate, endDate);

  const today = formatDateToInput(getToday());
  const initialSummonerInput = summoners.join(', ');
  const initialStart = startDate ?? today;
  const initialEnd = endDate ?? today;

  const handleApplySearch = (names: string[], s: string, e: string) => {
    setEditSearchOpen(false);
    if (names.length === 1) {
      const q = new URLSearchParams({ startDate: s, endDate: e }).toString();
      router.push(`/summoner/${encodeURIComponent(names[0])}?${q}`);
      return;
    }
    const q = new URLSearchParams({
      summoners: names.join(','),
      startDate: s,
      endDate: e,
    }).toString();
    router.push(`/summary?${q}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-semibold">소환사 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h2 className="text-2xl font-black text-on-surface mb-2">
            검색 결과를 불러올 수 없습니다
          </h2>
          <p className="text-on-surface-variant mb-6">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:scale-105 transition-all"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.players.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <h2 className="text-2xl font-black text-on-surface mb-2">검색 결과가 없습니다</h2>
          <p className="text-on-surface-variant mb-6">소환사명을 확인하고 다시 시도해주세요.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:scale-105 transition-all"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const editSearchModal =
    portalMounted &&
    editSearchOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-6 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          aria-label="검색 창 닫기"
          onClick={() => setEditSearchOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-edit-search-title"
          className="relative z-[1] w-full max-w-4xl max-h-[min(92dvh,100svh)] overflow-y-auto overscroll-y-contain touch-pan-y rounded-[1.75rem] sm:rounded-[2rem] bg-surface-container-lowest p-5 sm:p-6 shadow-2xl no-line-boundary"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2
              id="summary-edit-search-title"
              className="text-left text-lg font-black text-on-surface tracking-tight"
            >
              검색 변경
            </h2>
            <button
              type="button"
              onClick={() => setEditSearchOpen(false)}
              className="shrink-0 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              aria-label="닫기"
            >
              <span className="material-symbols-outlined text-xl leading-none">close</span>
            </button>
          </div>
          <SummonerSearchPanel
            formIdPrefix="summary-edit"
            showInfoText
            initialSummonerInput={initialSummonerInput}
            initialStartDate={initialStart}
            initialEndDate={initialEnd}
            onSearch={handleApplySearch}
          />
        </div>
      </div>,
      document.body,
    );

  return (
    <div
      data-comparison-layout="side-by-side"
      className="space-y-4 sm:space-y-6 md:space-y-7 w-full min-w-0 overflow-x-clip"
    >
      <button
        type="button"
        onClick={() => setEditSearchOpen(true)}
        className="w-full min-w-0 text-left bg-surface-container-lowest px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-3xl no-line-boundary border-2 border-transparent hover:border-primary/25 active:scale-[0.99] transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-container"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-0.5 sm:gap-2 text-center">
          <p className="text-on-surface-variant font-semibold text-xs sm:text-sm wrap-break-word leading-snug inline-flex flex-wrap items-center justify-center gap-1.5">
            <span className="material-symbols-outlined icon-sm text-primary shrink-0" aria-hidden>
              calendar_today
            </span>
            {data.periodStr}
          </p>
          <p className="text-primary text-[0.7rem] sm:text-xs font-bold sm:shrink-0">검색·기간 변경</p>
        </div>
      </button>

      {editSearchModal}

      <div className="summary-comparison-grid w-full min-w-0">
        {data.players.map((player, index) => (
          <PlayerCard key={player.riotId} player={player} playerIndex={index} />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player, playerIndex }: { player: Player; playerIndex: number }) {
  const { data: version } = useLatestVersion();
  const lanePreference = summarizeLaneFromChampions(player.topChampions);

  const getStreakText = () => {
    if (player.streak.type === 'NONE') return null;
    const type = player.streak.type === 'WIN' ? '연승' : '연패';
    return `${player.streak.count}${type} 중`;
  };

  return (
    <article className="bg-surface-container-lowest p-3 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl no-line-boundary w-full min-w-0 overflow-x-clip flex flex-col gap-4 sm:gap-5">
      <header className="flex flex-row md:grid md:grid-cols-[auto_1fr] md:gap-6 md:items-start gap-3 sm:gap-5 pb-4 border-b border-outline-variant/20">
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-container overflow-hidden">
            <img
              src={getProfileIconUrl(player.profileIconId, version)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-xs font-black px-2 py-1 rounded-full">
            Lv. {player.summonerLevel}
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-lg sm:text-2xl font-black text-on-surface mb-1.5 wrap-break-word leading-tight">
            {player.riotId}
          </h2>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1.5 mb-2">
            {player.soloRank && (
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="text-[0.7rem] font-bold text-on-surface-variant shrink-0">솔</span>
                <span className={`font-black ${getTierColor(player.soloRank.tier)}`}>
                  {getTierKoreanName(player.soloRank.tier)}{' '}
                  {getRankKoreanName(player.soloRank.rank)}
                </span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {player.soloRank.lp} LP
                </span>
              </div>
            )}
            {player.flexRank && (
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="text-[0.7rem] font-bold text-on-surface-variant shrink-0">자유</span>
                <span className={`font-black ${getTierColor(player.flexRank.tier)}`}>
                  {getTierKoreanName(player.flexRank.tier)}{' '}
                  {getRankKoreanName(player.flexRank.rank)}
                </span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {player.flexRank.lp} LP
                </span>
              </div>
            )}
          </div>

          <LanePreferenceBlurb summary={lanePreference} compact />

          {/* 스트릭 */}
          {getStreakText() && (
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-black ${
                player.streak.type === 'WIN'
                  ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                  : 'bg-red-500/20 text-red-700 border border-red-500/30'
              }`}
            >
              <span className="material-symbols-outlined icon-sm">
                {player.streak.type === 'WIN' ? 'trending_up' : 'trending_down'}
              </span>
              {getStreakText()}
            </div>
          )}
        </div>
      </header>

      <section className="min-w-0" aria-labelledby={`summary-queue-heading-${playerIndex}`}>
        <h3
          id={`summary-queue-heading-${playerIndex}`}
          className="text-[0.65rem] font-bold text-on-surface-variant mb-3 tracking-wide uppercase"
        >
          큐별 통계
        </h3>
        {/*
          모바일: 세로 스택(스크롤·스냅 없음) / md+: 동일 높이 3열 그리드
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 md:items-stretch min-w-0">
          <QueueStats title="솔로" queue={player.queues.solo} className="h-full min-h-0" />
          <QueueStats title="자유" queue={player.queues.flex} className="h-full min-h-0" />
          <QueueStats title="일반" queue={player.queues.normal} className="h-full min-h-0" />
        </div>
      </section>

      <section className="min-w-0 pt-1">
        <TopChampionsStrip champions={player.topChampions ?? []} surface="nested" />
      </section>
    </article>
  );
}

function QueueStats({
  title,
  queue,
  className = '',
}: {
  title: string;
  queue?: components['schemas']['QueueInfo'];
  className?: string;
}) {
  if (!queue || queue.games === 0) {
    return (
      <div
        className={`bg-surface-container p-4 sm:p-5 rounded-2xl h-full min-h-[10rem] flex flex-col ${className}`.trim()}
      >
        <h3 className="text-[0.7rem] font-bold text-on-surface-variant mb-3 tracking-wide">{title}</h3>
        <div className="flex flex-col items-center justify-center flex-1 py-4">
          <span className="material-symbols-outlined text-3xl text-outline mb-2" aria-hidden>
            inbox
          </span>
          <p className="text-xs font-bold text-on-surface-variant">전적 없음</p>
        </div>
      </div>
    );
  }

  const winRate = ((queue.win / queue.games) * 100).toFixed(1);

  return (
    <div className={`bg-surface-container p-4 sm:p-5 rounded-2xl h-full min-h-0 flex flex-col ${className}`.trim()}>
      <h3 className="text-[0.7rem] font-bold text-on-surface-variant mb-3 tracking-wide shrink-0">{title}</h3>
      <div className="space-y-2 flex-1 min-h-0">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant shrink-0">전적</span>
          <span className="font-black text-on-surface tabular-nums text-right">
            {queue.win}승 {queue.lose}패
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant">승률</span>
          <span className="font-black text-primary tabular-nums">{winRate}%</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant">KDA</span>
          <span className="font-black text-on-surface tabular-nums">{queue.kda}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant">CS</span>
          <span className="font-black text-on-surface tabular-nums">{queue.avgCsPerMin}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant">시야</span>
          <span className="font-black text-on-surface tabular-nums">{queue.avgVisionScore}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="font-bold text-on-surface-variant">딜</span>
          <span className="font-black text-on-surface tabular-nums">
            {new Intl.NumberFormat('ko-KR').format(queue.avgDamage)}
          </span>
        </div>
        <div className="pt-2 mt-0.5 border-t border-outline-variant/15">
          <p className="text-[0.6rem] font-bold text-on-surface-variant mb-1.5">멀티</p>
          <MultiKillsInline multiKills={queue.multiKills} compact />
        </div>
        <div className="flex items-center justify-between gap-2 pt-2 mt-0.5 border-t border-outline-variant/15">
          <span className="text-[0.7rem] font-bold text-on-surface-variant">한심</span>
          <span className="font-black text-xl sm:text-2xl text-error tabular-nums">{queue.hansimScore}</span>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="grow w-full min-w-0 max-w-screen-2xl mx-auto pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(4rem,env(safe-area-inset-bottom,0px))]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <ResultContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

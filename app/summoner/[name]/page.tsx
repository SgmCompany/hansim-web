'use client';

import { use, Suspense, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '../../../src/components/Navigation';
import { Footer } from '../../../src/components/Footer';
import { SummonerProfile } from '@/src/components/SummonerProfile';
import { StatsGrid } from '@/src/components/StatsGrid';
import { MultiKillsCard } from '@/src/components/MultiKillsDisplay';
import { TopChampionsStrip } from '@/src/components/TopChampionsStrip';
import { SummonerSearchPanel } from '@/src/components/SummonerSearchPanel';
import { formatDateToInput, getToday, normalizeSummaryDateRange } from '@/src/utils/date';
import { useBatchSummary } from '@/src/lib/api/hooks/useSummary';
import { getProfileIconUrl, useLatestVersion, getTierKoreanName, getRankKoreanName, getTierColor } from '@/src/lib/ddragon';
import { getPrimaryQueue } from '@/src/utils/queue';
import { summarizeLaneFromChampions } from '@/src/utils/lanePreference';
import { dedupeSummonerRiotIds, normalizeSummonerSearchToken } from '@/src/utils/riotId';
import { HansimOpportunityPanel } from '@/src/components/HansimOpportunityPanel';
import { HlsTierTable } from '@/src/components/HlsTierTable';

type PageProps = {
  params: Promise<{ name: string }>;
};

function SummonerContent({ name }: { name: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStartIn = searchParams.get('startDate');
  const rawEndIn = searchParams.get('endDate');
  const rawStart = rawStartIn?.trim() ? rawStartIn.trim() : undefined;
  const rawEnd = rawEndIn?.trim() ? rawEndIn.trim() : undefined;
  const today = formatDateToInput(getToday());

  const { startDate, endDate } = useMemo(() => {
    if (rawStart == null && rawEnd == null) {
      return { startDate: undefined as string | undefined, endDate: undefined as string | undefined };
    }
    const n = normalizeSummaryDateRange(rawStart ?? today, rawEnd ?? today);
    return { startDate: n.start, endDate: n.end };
  }, [rawStart, rawEnd, today]);

  const decodedName = decodeURIComponent(name);
  const riotIdForApi = normalizeSummonerSearchToken(decodedName);

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

  useEffect(() => {
    if (rawStart == null && rawEnd == null) return;
    const n = normalizeSummaryDateRange(rawStart ?? today, rawEnd ?? today);
    if (
      n.start === (rawStart ?? '') &&
      n.end === (rawEnd ?? '')
    ) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', n.start);
    params.set('endDate', n.end);
    router.replace(`/summoner/${encodeURIComponent(decodedName)}?${params.toString()}`, { scroll: false });
  }, [rawStart, rawEnd, today, searchParams, router, decodedName]);

  const { data, isLoading, isError, error } = useBatchSummary(
    riotIdForApi ? [riotIdForApi] : [],
    startDate,
    endDate,
  );
  const { data: version } = useLatestVersion();

  const initialSummonerInput = data?.players[0]?.riotId ?? decodedName;
  const initialStart = startDate ?? today;
  const initialEnd = endDate ?? today;

  const handleApplySearch = (names: string[], s: string, e: string) => {
    setEditSearchOpen(false);
    const unique = dedupeSummonerRiotIds(names);
    if (unique.length === 1) {
      const q = new URLSearchParams({ startDate: s, endDate: e }).toString();
      router.push(`/summoner/${encodeURIComponent(unique[0]!)}?${q}`);
      return;
    }
    const q = new URLSearchParams({
      summoners: unique.join(','),
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
          <h2 className="text-2xl font-black text-on-surface mb-2">소환사 정보를 불러올 수 없습니다</h2>
          <p className="text-on-surface-variant mb-6">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-on-primary rounded-sm font-bold hover:scale-105 transition-all"
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
          <h2 className="text-2xl font-black text-on-surface mb-2">소환사를 찾을 수 없습니다</h2>
          <p className="text-on-surface-variant mb-6">
            소환사명을 확인하고 다시 시도해주세요.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-on-primary rounded-sm font-bold hover:scale-105 transition-all"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const player = data.players[0];
  const primaryQueue = getPrimaryQueue(player.queues);
  const lanePreference = summarizeLaneFromChampions(player.topChampions);
  const safeFloat = (s: string | undefined, fallback = 0) => {
    if (s == null || s === '') return fallback;
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : fallback;
  };

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
          aria-labelledby="summoner-detail-edit-search-title"
          className="relative z-[1] w-full max-w-4xl max-h-[min(92dvh,100svh)] overflow-y-auto overscroll-y-contain touch-pan-y rounded-sm sm:rounded-md bg-surface-container-lowest p-5 sm:p-6 shadow-2xl no-line-boundary"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2
              id="summoner-detail-edit-search-title"
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
            formIdPrefix="summoner-detail-edit"
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

  // SummonerProfile 및 StatsGrid용
  const summonerData = {
    name: player.riotId.split('#')[0],
    level: player.summonerLevel,
    region: 'KR',
    avatarUrl: getProfileIconUrl(player.profileIconId, version),
    tier: player.soloRank?.tier || 'UNRANKED',
    lp: player.soloRank?.lp || 0,
    winStreak: player.streak.type === 'WIN' ? player.streak.count : 0,
    tierColor: getTierColor(player.soloRank?.tier || 'UNRANKED'),
    soloRank: player.soloRank ? {
      tier: getTierKoreanName(player.soloRank.tier),
      rank: getRankKoreanName(player.soloRank.rank),
      lp: player.soloRank.lp,
    } : undefined,
    flexRank: player.flexRank ? {
      tier: getTierKoreanName(player.flexRank.tier),
      rank: getRankKoreanName(player.flexRank.rank),
      lp: player.flexRank.lp,
    } : undefined,
    streak: player.streak,
    // StatsGrid용 (솔로 → 자유 → 일반 중 전적이 있는 대표 큐)
    winRate: primaryQueue ? safeFloat(primaryQueue.winRate) : 0,
    wins: primaryQueue?.win ?? 0,
    losses: primaryQueue?.lose ?? 0,
    kda: primaryQueue?.kda ?? '0.0',
    kdaDetail: null,
    killParticipation: null,
    csPerMin: primaryQueue ? safeFloat(primaryQueue.avgCsPerMin) : 0,
    visionScore: primaryQueue ? safeFloat(primaryQueue.avgVisionScore) : 0,
    avgDamage: primaryQueue?.avgDamage ?? 0,
  };

  return (
    <div
      data-layout="summoner-compact"
      data-emphasis="subtle"
      className="flex flex-col gap-4 sm:gap-5 w-full min-w-0 overflow-x-clip"
    >
      <button
        type="button"
        onClick={() => setEditSearchOpen(true)}
        className="w-full text-left bg-surface-container-lowest px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-sm sm:rounded-md no-line-boundary border-2 border-transparent hover:border-primary/25 active:scale-[0.99] transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-container"
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

      <HlsTierTable variant="compact" collapsible className="w-full max-w-none" />

      <HansimOpportunityPanel player={player} className="min-w-0 w-full" />

      {/*
        모바일: 프로필 → 멀티킬 → 챔피언 → 통계 (order-1~4)
        lg+: 왼쪽 프로필·멀티킬 / 오른쪽 통계 2행 병합, 그 아래 챔피언 전체 너비
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 lg:items-stretch">
        {/*
          모바일: 프로필+멀티킬을 한 세로 블록으로 묶음 / lg+: display:contents로 그리드 자식 유지
        */}
        <div className="order-1 flex flex-col gap-4 min-w-0 lg:contents">
          <SummonerProfile
            summoner={summonerData}
            lanePreference={lanePreference}
            className="mb-0 min-w-0 lg:col-span-5 lg:row-start-1 lg:self-start"
          />
          {primaryQueue && (
            <MultiKillsCard
              multiKills={primaryQueue.multiKills}
              hideWhenEmpty
              subtitle="솔·자유·일반 중 전적 있는 큐"
              className="mb-0 min-w-0 lg:col-span-5 lg:row-start-2 lg:self-start"
            />
          )}
        </div>
        <TopChampionsStrip
          champions={player.topChampions ?? []}
          surface="page"
          className="order-3 min-w-0 lg:order-none lg:col-span-12 lg:row-start-3"
        />
        <div className="order-4 min-w-0 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <StatsGrid layout="compact" stats={summonerData} />
        </div>
      </div>
    </div>
  );
}

export default function SummonerDetailPage({ params }: PageProps) {
  const { name } = use(params);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 w-full max-w-7xl mx-auto pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(4rem,env(safe-area-inset-bottom,0px))]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <SummonerContent name={name} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

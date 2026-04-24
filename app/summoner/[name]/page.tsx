'use client';

import { use, Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '../../../src/components/Navigation';
import { Footer } from '../../../src/components/Footer';
import { SummonerProfile } from '@/src/components/SummonerProfile';
import { StatsGrid } from '@/src/components/StatsGrid';
import { SummonerSearchPanel } from '@/src/components/SummonerSearchPanel';
import { formatDateToInput, getToday } from '@/src/utils/date';
import { useBatchSummary } from '@/src/lib/api/hooks/useSummary';
import { getProfileIconUrl, useLatestVersion, getTierKoreanName, getRankKoreanName, getTierColor } from '@/src/lib/ddragon';

type PageProps = {
  params: Promise<{ name: string }>;
};

function SummonerContent({ name }: { name: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const decodedName = decodeURIComponent(name);

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

  const { data, isLoading, isError, error } = useBatchSummary([decodedName], startDate, endDate);
  const { data: version } = useLatestVersion();

  const today = formatDateToInput(getToday());
  const initialSummonerInput = data?.players[0]?.riotId ?? decodedName;
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
          <h2 className="text-2xl font-black text-on-surface mb-2">소환사 정보를 불러올 수 없습니다</h2>
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
          <h2 className="text-2xl font-black text-on-surface mb-2">소환사를 찾을 수 없습니다</h2>
          <p className="text-on-surface-variant mb-6">
            소환사명을 확인하고 다시 시도해주세요.
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

  const player = data.players[0];

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
          className="relative z-[1] w-full max-w-4xl max-h-[min(92dvh,100svh)] overflow-y-auto overscroll-y-contain touch-pan-y rounded-[1.75rem] sm:rounded-[2rem] bg-surface-container-lowest p-5 sm:p-6 shadow-2xl no-line-boundary"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2
              id="summoner-detail-edit-search-title"
              className="text-left text-lg font-black text-on-surface tracking-tight"
            >
              소환사·기간 다시 검색
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
    // StatsGrid용
    winRate: player.queues.solo ? parseFloat(player.queues.solo.winRate) : 0,
    wins: player.queues.solo?.win || 0,
    losses: player.queues.solo?.lose || 0,
    kda: player.queues.solo?.kda || '0.0',
    kdaDetail: '0 / 0 / 0', // TODO: 백엔드에서 제공 시 업데이트
    killParticipation: 0, // TODO: 백엔드에서 제공 시 업데이트
    csPerMin: 0, // TODO: 백엔드에서 제공 시 업데이트
    avgCs: 0, // TODO: 백엔드에서 제공 시 업데이트
    visionScore: 0, // TODO: 백엔드에서 제공 시 업데이트
    wardsPerMin: 0, // TODO: 백엔드에서 제공 시 업데이트
    controlWards: 0, // TODO: 백엔드에서 제공 시 업데이트
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setEditSearchOpen(true)}
        className="w-full text-left mb-6 bg-surface-container-lowest p-4 sm:p-6 rounded-3xl no-line-boundary border-2 border-transparent hover:border-primary/25 active:scale-[0.99] transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-container"
      >
        <p className="text-center text-on-surface-variant font-semibold text-sm sm:text-base break-words leading-relaxed">
          <span className="material-symbols-outlined icon-sm align-middle mr-2 text-primary">
            calendar_today
          </span>
          {data.periodStr}
        </p>
        <p className="text-center text-primary text-xs sm:text-sm font-bold mt-2">
          탭하여 소환사·날짜 변경
        </p>
      </button>

      {editSearchModal}

      <SummonerProfile summoner={summonerData} />
      <StatsGrid stats={summonerData} />
    </>
  );
}

export default function SummonerDetailPage({ params }: PageProps) {
  const { name } = use(params);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
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

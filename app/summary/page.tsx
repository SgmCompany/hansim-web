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
  useChampions,
  getChampionNameById,
  getChampionKeyById,
} from '@/src/lib/ddragon/hooks/useChampions';
import {
  getTierKoreanName,
  getRankKoreanName,
  getTierColor,
  getProfileIconUrl,
  getChampionImageUrl,
  useLatestVersion,
} from '@/src/lib/ddragon';
import type { components } from '@/src/types/api.generated';

type Player = components['schemas']['Player'];

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summoners = searchParams.get('summoners')?.split(',').map((s) => s.trim()).filter(Boolean) || [];
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
    <div className="space-y-8">
      {/* 조회 기간 표시 — 클릭 시 홈과 동일한 검색 UI */}
      <button
        type="button"
        onClick={() => setEditSearchOpen(true)}
        className="w-full text-left bg-surface-container-lowest p-4 sm:p-6 rounded-3xl no-line-boundary border-2 border-transparent hover:border-primary/25 active:scale-[0.99] transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-container"
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

      {/* 소환사 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.players.map((player) => (
          <PlayerCard key={player.riotId} player={player} />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const { data: championsData } = useChampions();
  const { data: version } = useLatestVersion();

  const getStreakText = () => {
    if (player.streak.type === 'NONE') return null;
    const type = player.streak.type === 'WIN' ? '연승' : '연패';
    return `${player.streak.count}${type} 중`;
  };

  return (
    <div className="bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-3xl no-line-boundary">
      {/* 헤더: 소환사 정보 */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 pb-6 border-b border-outline-variant/20">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-surface-container overflow-hidden">
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
          <h2 className="text-xl sm:text-3xl font-black text-on-surface mb-2 break-words">
            {player.riotId}
          </h2>

          {/* 랭크 정보 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2 mb-2">
            {player.soloRank && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">솔로</span>
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">자유</span>
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

          {/* 스트릭 */}
          {getStreakText() && (
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black ${
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
      </div>

      {/* 큐별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QueueStats title="솔로 랭크" queue={player.queues.solo} />
        <QueueStats title="자유 랭크" queue={player.queues.flex} />
        <QueueStats title="일반 게임" queue={player.queues.normal} />
      </div>

      {/* 챔피언별 통계 */}
      {player.topChampions && player.topChampions.length > 0 && (
        <div className="relative -mx-2">
          <h3 className="text-xs font-bold text-on-surface-variant mb-4 tracking-wide uppercase px-2">
            챔피언별 통계
          </h3>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-outline scrollbar-track-transparent scroll-smooth">
              {player.topChampions.map((champion) => {
                const championKey = getChampionKeyById(champion.championId, championsData);
                const championName = getChampionNameById(champion.championId, championsData);

                return (
                  <div
                    key={champion.championId}
                    className="bg-surface-container p-5 rounded-2xl text-center w-[32%] min-w-[130px] max-w-[150px] flex-shrink-0 first:ml-0"
                  >
                    {championKey && (
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden">
                        <img
                          src={getChampionImageUrl(championKey, version)}
                          alt={championName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="font-black text-on-surface mb-2 text-base truncate">
                      {championName}
                    </p>
                    <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                      {champion.games}게임 · {champion.winRate}% · KDA {champion.kda}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* 오른쪽 페이드 그라데이션 */}
            {player.topChampions.length > 3 && (
              <div className="absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-surface-container-lowest to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QueueStats({
  title,
  queue,
}: {
  title: string;
  queue?: components['schemas']['QueueInfo'];
}) {
  if (!queue || queue.games === 0) {
    return (
      <div className="bg-surface-container p-6 rounded-2xl">
        <h3 className="text-xs font-bold text-on-surface-variant mb-4 tracking-wide uppercase">
          {title}
        </h3>
        <div className="flex flex-col items-center justify-center py-8">
          <span className="material-symbols-outlined text-4xl text-outline mb-3">inbox</span>
          <p className="text-sm font-bold text-on-surface-variant">전적 없음(큐손실)</p>
        </div>
      </div>
    );
  }

  const winRate = ((queue.win / queue.games) * 100).toFixed(1);

  return (
    <div className="bg-surface-container p-6 rounded-2xl">
      <h3 className="text-xs font-bold text-on-surface-variant mb-4 tracking-wide uppercase">
        {title}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">전적</span>
          <span className="font-black text-on-surface">
            {queue.win}승 {queue.lose}패
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">승률</span>
          <span className="font-black text-primary">{winRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">KDA</span>
          <span className="font-black text-on-surface">{queue.kda}</span>
        </div>
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-outline-variant/15">
          <span className="text-xs font-bold text-on-surface-variant">한심 점수</span>
          <span className="font-black text-2xl text-error">{queue.hansimScore}</span>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
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

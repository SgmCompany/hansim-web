'use client';

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '../../../src/components/Navigation';
import { Footer } from '../../../src/components/Footer';
import { SummonerProfile } from '@/src/components/SummonerProfile';
import { StatsGrid } from '@/src/components/StatsGrid';
import { useBatchSummary } from '@/src/lib/api/hooks/useSummary';
import { getProfileIconUrl, useLatestVersion, getTierKoreanName, getRankKoreanName, getTierColor } from '@/src/lib/ddragon';

type PageProps = {
  params: Promise<{ name: string }>;
};

function SummonerContent({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const decodedName = decodeURIComponent(name);

  const { data, isLoading, isError, error } = useBatchSummary([decodedName], startDate, endDate);
  const { data: version } = useLatestVersion();

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

  // SummonerProfile 및 StatsGrid를 위한 데이터 변환
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
      <div className="mb-6 bg-surface-container-lowest p-6 rounded-3xl no-line-boundary">
        <p className="text-center text-on-surface-variant font-semibold">
          <span className="material-symbols-outlined icon-sm align-middle mr-2">calendar_today</span>
          {data.periodStr}
        </p>
      </div>
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

      <main className="flex-1 pt-32 pb-20 px-8 lg:px-12 max-w-6xl mx-auto w-full">
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

'use client';

import { use } from 'react';
import { Navigation } from '../../../src/components/Navigation';
import { Footer } from '../../../src/components/Footer';
import { SummonerProfile } from '@/src/components/SummonerProfile';
import { StatsGrid } from '@/src/components/StatsGrid';

type PageProps = {
  params: Promise<{ name: string }>;
};

// Mock 데이터
const mockSummonerData = {
  name: '용쿠리몽',
  level: 428,
  region: 'KR',
  rank: 1245,
  percentile: 0.04,
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkg4FF5TVxfOmczcz10sX5unX_AUBmJZWus2zmVJH5dOF8zGDJocr4b1pvc-Eb0roh8v-3mep5O81pQrnP6QEWvjWr9UYzMlHdfNT2la7IFfZuo35w_CYoVBwKavD4DGiJ5UWOhvlCcywBPEDWurzKYG15HG3wZcoNOR0D3_FRGue4PQ3j31Oc7zxpTX8l8W6JhUVswpApqVxvMjBDUHqd9pgJfYze90gD0lzWs7gWAV6sfwZ1Lp16kRgWlrCGb2WMR9CN_tE8wck',
  winRate: 58,
  wins: 124,
  losses: 90,
  tier: 'Challenger',
  lp: 742,
  topPercent: 0.034,
  winStreak: 3,
  kda: '3.82:1',
  kdaDetail: '7.4 / 4.2 / 8.6',
  killParticipation: 62,
  csPerMin: 9.2,
  avgCs: 284,
  csRank: 2,
  visionScore: 42.8,
  wardsPerMin: 1.4,
  controlWards: 3.4,
};

export default function SummonerDetailPage({ params }: PageProps) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 p-8 lg:p-12 max-w-6xl mx-auto w-full pt-28">
        <SummonerProfile summoner={mockSummonerData} />
        <StatsGrid stats={mockSummonerData} />
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { dedupeSummonerRiotIds } from '@/src/utils/riotId';
import { Navigation } from '../src/components/Navigation';
import { HeroSection } from '../src/components/HeroSection';
import { HlsTierTable } from '@/src/components/HlsTierTable';
import { Footer } from '../src/components/Footer';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (summonerNames: string[], startDate: string, endDate: string) => {
    const ids = dedupeSummonerRiotIds(summonerNames);
    // 단일 소환사 검색 시 summoner/[name] 페이지로 이동
    if (ids.length === 1) {
      const queryString = new URLSearchParams({
        startDate,
        endDate,
      }).toString();
      router.push(`/summoner/${encodeURIComponent(ids[0]!)}?${queryString}`);
      return;
    }

    // 다중 소환사 검색 시 summary 페이지로 이동
    const queryString = new URLSearchParams({
      summoners: ids.join(','),
      startDate,
      endDate,
    }).toString();

    router.push(`/summary?${queryString}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation isHomePage />

      <main className="grow w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        <HeroSection onSearch={handleSearch} />
        <div className="w-full mb-10 sm:mb-14 flex justify-center min-w-0 px-0">
          <div className="w-full max-w-4xl">
            <HlsTierTable variant="compact" collapsible defaultOpen />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

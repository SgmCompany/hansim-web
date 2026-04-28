'use client';

import { useRouter } from 'next/navigation';
import { dedupeSummonerRiotIds } from '@/src/utils/riotId';
import { Navigation } from '../src/components/Navigation';
import { HeroSection } from '../src/components/HeroSection';
import { HlsTierTable } from '@/src/components/HlsTierTable';
import { LeaderboardSection } from '../src/components/LeaderboardSection';
import { Footer } from '../src/components/Footer';

// Mock 리더보드 데이터
const mockLeaderboard = [
  {
    rank: 1,
    name: 'Hide on bush',
    tier: 'Challenger',
    lp: 1248,
    score: 98.4,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvLLJzlbInB9OHiJoQTq7HDMGh5fbatYCDVQ6ySNG-PS_SQ68C9VCEvs54kitOyEX7dtijjpWS1ETgfDrLbEkYitrNYP5KffxRJQT-LjBXjYJ9i8LHX6L41o3cCtqKoBWpuq4vlGe294Yb9borU9yo6Xw5e9ud-iwM1CwtSyUP-getgyC-AksY7KQLyFERlCQPjz9IiNqsWIN3xlguJPmJSdUERYCmoqyuA8vx2VhEg5Lo3wYdoam8R8Obn5BHAEw6ocfOlYqBTEQ',
  },
  {
    rank: 2,
    name: 'ShowMaker',
    tier: 'Challenger',
    lp: 1112,
    score: 95.2,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoCbZrS7CWTRAAH288lODkmOKVewPwnddi3lMEd-wJ2L7yG_ZhcO-2tP5FaROh-yE-qHBnZqbYIxeKIUXbgDcY7z3VmeZ3_CIG_CCrwAAysKbgyOJ9TgCekfZ08Y424P_eDcblTM0jisIeWIKJdtOI2ui4KzLbGJs1b3Z4K7KzTq5rB4uM3L_1xKQ_KjXrsXbAK5SpLS9IHXrU2ECwoWkVzjEbOLXGzqHvvXb16cwUk4KAfYAC7b-czITa9Uy9O8YoyFA4Pjz-RVnw',
  },
  {
    rank: 3,
    name: 'Chovy',
    tier: 'Challenger',
    lp: 1089,
    score: 94.8,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBz1kIvZRCiCmaXrE8GJRsHNtP_UvxSE5IBK1rxx9FEgQWhstPc5NaCRIziltCTyKpx7BsZvqQPz5qHuGVElaVyEpd6bStqHZ5sn3QH9VFTISCF_ixp2JZR3F19GemGkiuqZEkgG3Vn2p7B_vsrVc2FOonYQSsmoRd56qJ3uxeZmuMnoe3FnTqI45JrlnQ9vp_MV3-ahN3F6wsC6mXyRK8Vqp8Vf_oxknkbOm3UUm6BJk21p2trKvW_Qa8xdRDAKOX7bd6UbEBQUw',
  },
];

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
        <LeaderboardSection players={mockLeaderboard} />
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { Navigation } from '../src/components/Navigation';
import { HeroSection } from '../src/components/HeroSection';
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCoCbZrS7CWTRAAH288lODkmOKVewPwnddi3lMEd-wJ2L7yG_ZcO-2tP5FaROh-yE-qHBnZqbYIxeKIUXbgDcY7z3VmeZ3_CIG_CCrwAAysKbgyOJ9TgCekfZ08Y424P_eDcblTM0jisIeWIKJdtOI2ui4KzLbGJs1b3Z4K7KzTq5rB4uM3L_1xKQ_KjXrsXbAK5SpLS9IHXrU2ECwoWkVzjEbOLXGzqHvvXb16cwUk4KAfYAC7b-czITa9Uy9O8YoyFA4Pjz-RVnw',
  },
  {
    rank: 3,
    name: 'Chovy',
    tier: 'Challenger',
    lp: 1089,
    score: 94.8,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBz1kIvZRCiCmaXrE8GJRsHNtP_UvxSE5IBK1rxx9FEgQWhstPc5NaCRIziltCTyKpx7BsZvqQPz5qHuGVEElaVyEpd6bStqHZ5sn3QH9VFTISCF_ixp2JZR3F19GemGkiuqZEkgG3Vn2p7B_vsrVc2FOonYQSsmoRd56qJ3uxeZmuMnoe3FnTqI45JrlnQ9vp_MV3-ahN3F6wsC6mXyRK8Vqp8Vf_oxknkbOm3UUm6BJk21p2trKvW_Qa8xdRDAKOX7bd6UbEBQUw',
  },
];

export default function HomePage() {
  const handleSearch = (summonerNames: string[], dateRange: string) => {
    console.log('검색:', summonerNames, dateRange);
    // TODO: API 호출 또는 라우팅
    // router.push(`/summoner/${summonerNames.join(',')}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation currentPage="home" isHomePage />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
        <HeroSection onSearch={handleSearch} />
        <LeaderboardSection players={mockLeaderboard} />
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { SummonerSearchPanel } from './SummonerSearchPanel';

type HeroSectionProps = {
  onSearch?: (summonerNames: string[], startDate: string, endDate: string) => void;
};

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center text-center pt-4 sm:pt-8 md:pt-10 mb-8 sm:mb-12 px-0 w-full min-w-0">
      <div className="mb-6 sm:mb-8 relative">
        <span className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-[0.625rem] sm:text-xs font-bold tracking-widest mb-3 sm:mb-4">
          ENGINEERING CHEER
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-on-background leading-tight px-1">
          당신의 <span className="text-primary">한심지수</span>를 알아보세요
        </h1>
      </div>

      <div className="w-full max-w-4xl">
        <SummonerSearchPanel
          formIdPrefix="hero"
          onSearch={(names, start, end) => onSearch?.(names, start, end)}
        />
      </div>
    </section>
  );
}

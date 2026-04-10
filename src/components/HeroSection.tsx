'use client';

import { useState } from 'react';

type HeroSectionProps = {
  onSearch?: (summonerNames: string[], dateRange: string) => void;
};

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchInput, setSearchInput] = useState('');
  const [dateRange, setDateRange] = useState('최근 30일');

  const handleSearch = () => {
    const names = searchInput
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    
    if (names.length > 0) {
      onSearch?.(names, dateRange);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center mb-24">
      <div className="mb-8 relative">
        <span className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-bold tracking-widest mb-4">
          ENGINEERING CHEER
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-background leading-tight">
          당신의 협곡 실력을
          <br />
          <span className="text-primary">정밀 분석</span>합니다.
        </h1>
      </div>

      {/* Central Search Bar */}
      <div className="w-full max-w-3xl bg-surface-container-lowest p-4 rounded-xl no-line-boundary flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow relative w-full">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="소환사명, 소환사명..."
            className="w-full pl-14 pr-6 py-5 bg-surface-container rounded-full border-none focus:ring-4 focus:ring-primary-container text-lg font-semibold placeholder:text-outline-variant outline-none"
          />
        </div>

        {/* Date Picker UI Trigger */}
        <button
          type="button"
          className="flex items-center gap-3 px-6 py-5 bg-surface-container hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant font-bold whitespace-nowrap"
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span>{dateRange}</span>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="w-full md:w-auto px-10 py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-extrabold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          분석하기
        </button>
      </div>

      <p className="mt-6 text-on-surface-variant font-medium text-sm">
        <span className="material-symbols-outlined icon-sm align-middle text-primary mr-1">
          info
        </span>
        여러 명의 소환사를 쉼표(,)로 구분하여 한 번에 검색할 수 있습니다.
      </p>
    </section>
  );
}

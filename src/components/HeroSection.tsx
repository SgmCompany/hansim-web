'use client';

import { useState } from 'react';
import { formatDateToInput, getToday, isValidDateRange } from '@/src/utils/date';
import { DateRangePicker } from './DateRangePicker';

type HeroSectionProps = {
  onSearch?: (summonerNames: string[], startDate: string, endDate: string) => void;
};

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchInput, setSearchInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = formatDateToInput(getToday());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [dateError, setDateError] = useState('');

  const handleSearch = () => {
    const names = searchInput
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      alert('소환사명을 입력해주세요.');
      return;
    }

    const validation = isValidDateRange(new Date(startDate), new Date(endDate));
    if (!validation.valid) {
      setDateError(validation.error || '날짜 범위가 올바르지 않습니다.');
      return;
    }

    setDateError('');
    onSearch?.(names, startDate, endDate);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const getDateRangeText = () => {
    if (startDate === endDate && startDate === today) {
      return '오늘';
    }
    return `${startDate} ~ ${endDate}`;
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    setDateError('');
  };

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
    setDateError('');
  };

  return (
    <section className="flex flex-col items-center justify-center text-center mb-12">
      <div className="mb-8 relative">
        <span className="inline-block px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-bold tracking-widest mb-4">
          ENGINEERING CHEER
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-background leading-tight">
          당신의 <span className="text-primary">한심지수</span>를 알아보세요
        </h1>
      </div>

      {/* Central Search Bar Container */}
      <div className="w-full max-w-4xl">
        {/* Search Bar */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl no-line-boundary flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-grow relative w-full min-w-0">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline text-2xl">
              search
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="소환사명#태그, 소환사명#태그..."
              className="w-full pl-16 pr-6 py-6 bg-surface-container rounded-full border-none focus:ring-4 focus:ring-primary-container text-lg md:text-xl font-semibold placeholder:text-outline-variant outline-none truncate"
            />
          </div>

          {/* Date Picker UI Trigger */}
          <button
            type="button"
            onClick={toggleDatePicker}
            className="flex items-center justify-center gap-2 px-5 md:px-6 py-6 bg-surface-container hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant font-bold whitespace-nowrap shrink-0 min-w-0"
          >
            <span className="material-symbols-outlined shrink-0 text-xl">calendar_today</span>
            <span className="hidden sm:inline truncate max-w-[150px] md:max-w-none text-base md:text-lg">
              {getDateRangeText()}
            </span>
            <span className="sm:hidden text-sm">날짜</span>
            <span
              className={`material-symbols-outlined text-lg shrink-0 transition-transform ${showDatePicker ? 'rotate-180' : ''}`}
            >
              keyboard_arrow_down
            </span>
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full md:w-auto p-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center"
            aria-label="검색"
          >
            <span className="material-symbols-outlined text-3xl">search</span>
          </button>
        </div>

        {/* Date Range Picker - 검색바 아래에 배치 */}
        {showDatePicker && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              error={dateError}
            />

            {/* 안내 문구 */}
            <p className="mt-4 text-on-surface-variant font-medium text-sm">
              <span className="material-symbols-outlined icon-sm align-middle text-primary mr-1">
                info
              </span>
              여러 명의 소환사를 쉼표(,)로 구분하여 한 번에 검색할 수 있습니다. (예: 페이커#KR1,
              쇼메이커#KR1)
            </p>
          </div>
        )}
      </div>

      {/* 캘린더 닫혀있을 때만 안내 문구 표시 */}
      {!showDatePicker && (
        <p className="mt-3 text-on-surface-variant font-medium text-sm">
          <span className="material-symbols-outlined icon-sm align-middle text-primary mr-1">
            info
          </span>
          여러 명의 소환사를 쉼표(,)로 구분하여 한 번에 검색할 수 있습니다. (예: 페이커#KR1,
          쇼메이커#KR1)
        </p>
      )}
    </section>
  );
}

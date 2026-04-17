'use client';

import { useState } from 'react';
import { formatDateToInput, getToday, isValidDateRange } from '@/src/utils/date';

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

  // 시작일 변경 핸들러: 종료일이 30일 초과 시 자동 조정
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    setDateError('');

    // 현재 종료일이 새 시작일로부터 30일을 초과하는지 확인
    const start = new Date(newStartDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      // 30일 후의 날짜로 종료일 자동 조정
      const maxEndDate = new Date(start);
      maxEndDate.setDate(maxEndDate.getDate() + 30);

      // 오늘을 넘지 않도록
      const todayDate = new Date(today);
      const adjustedEndDate = maxEndDate > todayDate ? todayDate : maxEndDate;

      setEndDate(formatDateToInput(adjustedEndDate));
    }
  };

  // 종료일 변경 핸들러: 시작일로부터 30일 이내인지 확인
  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
    setDateError('');
  };

  // 시작일 기준 최대 종료일 계산 (30일 후 또는 오늘 중 더 이른 날짜)
  const getMaxEndDate = () => {
    const start = new Date(startDate);
    const maxDate = new Date(start);
    maxDate.setDate(maxDate.getDate() + 30);

    const todayDate = new Date(today);
    return formatDateToInput(maxDate > todayDate ? todayDate : maxDate);
  };

  // 종료일 기준 최소 시작일 계산 (30일 전)
  const getMinStartDate = () => {
    const end = new Date(endDate);
    const minDate = new Date(end);
    minDate.setDate(minDate.getDate() - 30);

    return formatDateToInput(minDate);
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

        {/* Date Picker Dropdown - 검색바 아래에 배치 */}
        {showDatePicker && (
          <div className="mt-4 bg-surface-container-lowest p-6 rounded-3xl no-line-boundary animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <label className="block text-sm font-bold text-on-surface-variant mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={getMinStartDate()}
                  max={endDate}
                  className="w-full px-4 py-3 bg-surface-container rounded-2xl border-none focus:ring-4 focus:ring-primary-container text-on-surface font-semibold outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-on-surface-variant mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  min={startDate}
                  max={getMaxEndDate()}
                  className="w-full px-4 py-3 bg-surface-container rounded-2xl border-none focus:ring-4 focus:ring-primary-container text-on-surface font-semibold outline-none"
                />
              </div>
            </div>
            {dateError && (
              <p className="mt-3 text-error text-sm font-semibold">
                <span className="material-symbols-outlined icon-sm align-middle mr-1">error</span>
                {dateError}
              </p>
            )}
            <p className="mt-3 text-on-surface-variant text-xs">최대 30일까지 선택 가능합니다.</p>

            {/* 안내 문구를 모달 내부로 이동 */}
            <p className="mt-4 pt-4 border-t border-outline-variant/20 text-on-surface-variant font-medium text-sm">
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatDateToInput, getToday, isValidDateRange } from '@/src/utils/date';
import { DEFAULT_RIOT_TAGLINE, normalizeSummonerSearchInput } from '@/src/utils/riotId';
import { useRecentSummoners } from '@/src/hooks/useRecentSummoners';
import {
  applySummonerSuggestionToInput,
  getActiveSummonerSearchToken,
  suggestRecentsForToken,
} from '@/src/utils/recentSummoners';
import { DateRangePicker } from './DateRangePicker';

export const SUMMONER_SEARCH_INFO = `소환사명·기간(최대 7일)으로 검색합니다. 닉네임만 쓰면 자동으로 #${DEFAULT_RIOT_TAGLINE}이 붙습니다. 여러 명은 쉼표(,)로 구분 — 예: 페이커, 쇼메이커 또는 페이커#KR1`;

export type SummonerSearchPanelProps = {
  onSearch: (summonerNames: string[], startDate: string, endDate: string) => void;
  /** URL 등에서 넘긴 초기 소환사 입력 (쉼표 구분) */
  initialSummonerInput?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  showInfoText?: boolean;
  /** 날짜 다이얼로그 id·aria 중복 방지 */
  formIdPrefix?: string;
  /** localStorage 최근 검색 칩 (기본 true) */
  showRecent?: boolean;
  className?: string;
};

export function SummonerSearchPanel({
  onSearch,
  initialSummonerInput = '',
  initialStartDate,
  initialEndDate,
  showInfoText = true,
  formIdPrefix = 'summoner-search',
  showRecent = true,
  className = '',
}: SummonerSearchPanelProps) {
  const today = formatDateToInput(getToday());
  const {
    items: recentItems,
    record: recordRecent,
    remove: removeRecent,
    ready: recentReady,
  } = useRecentSummoners();
  const [searchInput, setSearchInput] = useState(initialSummonerInput);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate ?? today);
  const [endDate, setEndDate] = useState(initialEndDate ?? today);
  const [dateError, setDateError] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestHighlight, setSuggestHighlight] = useState(-1);

  const activeToken = getActiveSummonerSearchToken(searchInput);
  const suggestions = useMemo(() => {
    if (!recentReady || recentItems.length === 0) return [];
    return suggestRecentsForToken(recentItems, activeToken, 6);
  }, [recentReady, recentItems, activeToken]);

  const showSuggestionList = inputFocused && suggestions.length > 0;
  const suggestionListId = `${formIdPrefix}-suggestions`;
  const summonerInputId = `${formIdPrefix}-summoner-input`;

  useEffect(() => {
    setSuggestHighlight(-1);
  }, [activeToken, suggestions.length]);

  useEffect(() => {
    setSearchInput(initialSummonerInput);
  }, [initialSummonerInput]);

  useEffect(() => {
    if (initialStartDate) setStartDate(initialStartDate);
  }, [initialStartDate]);

  useEffect(() => {
    if (initialEndDate) setEndDate(initialEndDate);
  }, [initialEndDate]);

  const runSearch = (names: string[]) => {
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
    if (showRecent) {
      recordRecent(names);
    }
    onSearch(names, startDate, endDate);
  };

  const handleSearch = () => {
    runSearch(normalizeSummonerSearchInput(searchInput));
  };

  const handleRecentChipClick = (riotId: string) => {
    setSearchInput(riotId);
    runSearch([riotId]);
  };

  const applySuggestion = (riotId: string) => {
    setSearchInput(applySummonerSuggestionToInput(searchInput, riotId));
    setSuggestHighlight(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (showSuggestionList) {
        e.preventDefault();
        setInputFocused(false);
        setSuggestHighlight(-1);
      }
      return;
    }

    if (showSuggestionList && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestHighlight((h) => (h + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
        return;
      }
      if (e.key === 'Enter' && suggestHighlight >= 0 && suggestions[suggestHighlight]) {
        e.preventDefault();
        applySuggestion(suggestions[suggestHighlight]);
        return;
      }
    }

    if (e.key === 'Enter') {
      handleSearch();
    }
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const dialogTitleId = `${formIdPrefix}-date-range-title`;
  const dialogId = `${formIdPrefix}-date-range-dialog`;

  useEffect(() => {
    if (!showDatePicker) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [showDatePicker]);

  const dateModal =
    mounted &&
    showDatePicker &&
    createPortal(
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          aria-label="날짜 선택 닫기"
          onClick={() => setShowDatePicker(false)}
        />
        <div
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="relative z-[1] w-full max-w-sm max-h-[min(90dvh,100svh)] overflow-y-auto overscroll-y-contain touch-pan-y rounded-[1.75rem] sm:rounded-[2rem] bg-surface-container-lowest p-5 sm:p-6 shadow-2xl no-line-boundary animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2
              id={dialogTitleId}
              className="text-left text-lg font-black text-on-surface tracking-tight"
            >
              검색 기간 선택
            </h2>
            <button
              type="button"
              onClick={() => setShowDatePicker(false)}
              className="shrink-0 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              aria-label="닫기"
            >
              <span className="material-symbols-outlined text-xl leading-none">close</span>
            </button>
          </div>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            error={dateError}
          />

          <p className="mt-4 text-left text-on-surface-variant font-medium text-xs sm:text-sm leading-relaxed">
            <span className="material-symbols-outlined icon-sm align-middle text-primary mr-1">
              info
            </span>
            {SUMMONER_SEARCH_INFO}
          </p>

          <button
            type="button"
            onClick={() => setShowDatePicker(false)}
            className="mt-5 w-full min-h-12 py-3.5 rounded-full bg-primary text-white font-bold text-sm sm:text-base shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
          >
            확인
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className={`w-full min-w-0 ${className}`}>
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl sm:rounded-2xl no-line-boundary flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch">
        <div className="flex-grow relative w-full min-w-0 z-10">
          <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-outline text-xl sm:text-2xl pointer-events-none z-10">
            search
          </span>
          <input
            id={summonerInputId}
            type="text"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-expanded={showSuggestionList}
            aria-controls={suggestionListId}
            aria-activedescendant={
              showSuggestionList && suggestHighlight >= 0
                ? `${suggestionListId}-opt-${suggestHighlight}`
                : undefined
            }
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setInputFocused(false), 160);
            }}
            placeholder={`닉네임 또는 닉네임#태그 (미입력 시 #${DEFAULT_RIOT_TAGLINE})`}
            className="relative z-10 w-full pl-11 sm:pl-6 pr-4 sm:pr-6 py-4 sm:py-6 bg-surface-container rounded-full border-none focus:ring-4 focus:ring-primary-container text-base sm:text-lg md:text-xl font-semibold placeholder:text-outline-variant outline-none min-w-0"
          />
          {showSuggestionList && (
            <ul
              id={suggestionListId}
              role="listbox"
              aria-label="최근 검색에서 추천"
              className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 max-h-56 overflow-y-auto rounded-xl sm:rounded-2xl bg-surface-container-lowest py-2 shadow-xl no-line-boundary ring-1 ring-outline-variant/15"
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestions.map((riotId, i) => (
                <li key={`${riotId}-${i}`} role="presentation">
                  <button
                    type="button"
                    id={`${suggestionListId}-opt-${i}`}
                    role="option"
                    aria-selected={i === suggestHighlight}
                    className={`flex w-full min-w-0 items-center gap-2 px-4 py-3 text-left text-sm sm:text-base font-bold transition-colors ${
                      i === suggestHighlight
                        ? 'bg-primary-container/50 text-primary'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                    onClick={() => applySuggestion(riotId)}
                  >
                    <span
                      className="material-symbols-outlined text-lg text-primary shrink-0"
                      aria-hidden
                    >
                      history
                    </span>
                    <span className="min-w-0 truncate">{riotId}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDatePicker(true)}
          aria-expanded={showDatePicker}
          aria-haspopup="dialog"
          aria-controls={dialogId}
          className="min-h-[3.25rem] sm:min-h-14 w-full md:w-auto md:min-w-[17.5rem] lg:min-w-[19rem] md:shrink-0 flex items-center gap-2 px-4 sm:px-5 md:px-6 py-4 sm:py-6 bg-surface-container hover:bg-surface-container-high transition-colors rounded-full text-on-surface-variant font-bold active:scale-[0.98]"
        >
          <span className="material-symbols-outlined shrink-0 text-xl">calendar_today</span>
          <span className="min-w-0 flex-1 truncate text-left text-sm sm:text-base md:text-lg">
            {getDateRangeText()}
          </span>
          <span
            className={`material-symbols-outlined text-lg shrink-0 transition-transform ${showDatePicker ? 'rotate-180' : ''}`}
          >
            expand_more
          </span>
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="w-full md:w-auto min-h-[3.25rem] p-4 sm:p-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center"
          aria-label="검색"
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">search</span>
        </button>
      </div>

      {showRecent && recentReady && recentItems.length > 0 && (
        <div className="mt-3 sm:mt-4 min-w-0">
          <p className="text-[0.65rem] sm:text-xs font-bold text-on-surface-variant tracking-wide mb-2 px-0.5">
            최근 검색
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-0.5 px-0.5 scroll-pl-1 scroll-pr-2 snap-x snap-mandatory">
            {recentItems.map((riotId, i) => (
              <div
                key={`recent-${riotId}-${i}`}
                className="snap-start shrink-0 inline-flex items-center gap-0.5 max-w-[min(100%,16rem)] rounded-full bg-surface-container pl-3.5 pr-1 py-1.5 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleRecentChipClick(riotId)}
                  className="min-w-0 truncate text-left text-xs sm:text-sm font-bold text-on-surface hover:text-primary transition-colors"
                  title={riotId}
                >
                  {riotId}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecent(riotId);
                  }}
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                  aria-label={`${riotId} 최근 검색에서 삭제`}
                >
                  <span className="material-symbols-outlined text-lg leading-none" aria-hidden>
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {dateModal}

      {showInfoText && (
        <p className="mt-3 text-on-surface-variant font-medium text-xs sm:text-sm text-left sm:text-center max-w-4xl mx-auto leading-relaxed px-1">
          <span className="material-symbols-outlined icon-sm align-middle text-primary mr-1">
            info
          </span>
          {SUMMONER_SEARCH_INFO}
        </p>
      )}
    </div>
  );
}

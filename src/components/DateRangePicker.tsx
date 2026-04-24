'use client';

import { useState } from 'react';
import { formatDateToInput, getDaysDifference, getToday } from '@/src/utils/date';

function dateStrToday(): string {
  return formatDateToInput(getToday());
}

/** YYYY-MM-DD 문자열 기준으로 a와 b 중 더 이른 날 */
function minDateStr(a: string, b: string): string {
  return a <= b ? a : b;
}

/** 달력에서 선택 가능한 마지막 날(오늘) */
function isDateAfterToday(date: Date): boolean {
  return formatDateToInput(date) > dateStrToday();
}

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error?: string;
};

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
}: DateRangePickerProps) {
  const [selectingStart, setSelectingStart] = useState(true);

  // 현재 보여지는 월/년
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const canGoToNextMonth = (): boolean => {
    const firstOfMonthAfterView = new Date(viewYear, viewMonth + 1, 1);
    const today = getToday();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return firstOfMonthAfterView <= todayStart;
  };

  const goToNextMonth = () => {
    if (!canGoToNextMonth()) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  const handleDateClick = (dateStr: string) => {
    const clickedDate = new Date(dateStr);

    if (isDateAfterToday(clickedDate)) {
      return;
    }

    const todayStr = dateStrToday();
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);

    if (selectingStart) {
      // 시작일 선택 중
      onStartDateChange(dateStr);

      // 종료일이 시작일보다 이전이면 종료일도 같이 변경
      if (clickedDate > currentEnd) {
        onEndDateChange(dateStr);
      }

      // 기존 종료일과의 차이가 7일 초과면 종료일 자동 조정 (오늘을 넘지 않음)
      const diffDays = getDaysDifference(clickedDate, currentEnd);
      if (diffDays > 7) {
        const newEnd = new Date(clickedDate);
        newEnd.setDate(newEnd.getDate() + 7);
        onEndDateChange(minDateStr(formatDateToInput(newEnd), todayStr));
      }

      setSelectingStart(false);
    } else {
      // 종료일 선택 중
      const endStr = minDateStr(dateStr, todayStr);
      onEndDateChange(endStr);

      const endAsDate = new Date(endStr);

      // 종료일이 시작일보다 이전이면 시작일도 같이 변경
      if (endAsDate < currentStart) {
        onStartDateChange(endStr);
      }

      // 시작일과의 차이가 7일 초과면 자동 조정
      const startForDiff = endAsDate < currentStart ? endAsDate : currentStart;
      const diffDays = getDaysDifference(startForDiff, endAsDate);
      if (diffDays > 7) {
        const newStart = new Date(endAsDate);
        newStart.setDate(newStart.getDate() - 7);
        onStartDateChange(formatDateToInput(newStart));
      }

      setSelectingStart(true);
    }
  };

  const generateCalendar = () => {
    // 현재 보기 월의 1일과 마지막 날
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);

    // 달력 시작 (일요일부터)
    const startPadding = firstDay.getDay();

    const days: (Date | null)[] = [];

    // 이전 달 날짜 패딩
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // 현재 보기 월의 날짜
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(viewYear, viewMonth, day));
    }

    return days;
  };

  const isDateInRange = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    const dateStr = formatDateToInput(date);
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isStartDate = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return formatDateToInput(date) === startDate;
  };

  const isEndDate = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return formatDateToInput(date) === endDate;
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = generateCalendar();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 max-w-[min(100%,17.5rem)] mx-auto">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-2 gap-1">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-1 hover:bg-surface-container rounded-lg transition-colors shrink-0"
          aria-label="이전 달"
        >
          <span className="material-symbols-outlined text-[1.125rem] leading-none">
            chevron_left
          </span>
        </button>

        <div className="flex items-center gap-1 min-w-0 justify-center">
          <button
            type="button"
            onClick={goToToday}
            className="px-2 py-0.5 text-[0.6875rem] font-bold text-primary hover:bg-primary/10 rounded-md transition-colors shrink-0"
          >
            오늘
          </button>
          <span className="text-sm font-black text-on-surface truncate">
            {viewYear}년 {monthNames[viewMonth]}
          </span>
        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoToNextMonth()}
          className="p-1 rounded-lg transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:bg-surface-container enabled:cursor-pointer"
          aria-label="다음 달"
        >
          <span className="material-symbols-outlined text-[1.125rem] leading-none">
            chevron_right
          </span>
        </button>
      </div>

      {/* 선택 모드 표시 */}
      <div className="flex gap-1.5 mb-2">
        <button
          type="button"
          onClick={() => setSelectingStart(true)}
          className={`flex-1 min-w-0 px-2 py-1.5 rounded-xl font-bold text-[0.6875rem] transition-all truncate ${
            selectingStart
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          시작: {startDate}
        </button>
        <button
          type="button"
          onClick={() => setSelectingStart(false)}
          className={`flex-1 min-w-0 px-2 py-1.5 rounded-xl font-bold text-[0.6875rem] transition-all truncate ${
            !selectingStart
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          종료: {endDate}
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[0.625rem] font-bold text-on-surface-variant py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-8" />;
          }

          const dateStr = formatDateToInput(date);
          const isFuture = isDateAfterToday(date);
          const inRange = isDateInRange(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);
          const isTodayDate = isToday(date);

          let dayClasses =
            'h-8 w-full text-[0.75rem] font-bold rounded-lg transition-colors flex items-center justify-center';
          if (isFuture) {
            dayClasses += ' text-on-surface/25 opacity-40 cursor-not-allowed';
          } else if (isStart || isEnd) {
            dayClasses +=
              ' bg-primary text-white ring-2 ring-primary-dim ring-inset z-[1] shadow-sm';
          } else if (inRange) {
            dayClasses += ' bg-primary/20 text-on-primary-container';
          } else {
            dayClasses += ' text-on-surface hover:bg-surface-container';
          }
          if (isTodayDate && !isStart && !isEnd && !isFuture) {
            dayClasses += ' ring-1 ring-primary/60 ring-inset';
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isFuture}
              onClick={() => handleDateClick(dateStr)}
              className={dayClasses}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-error text-xs font-semibold">
          <span className="material-symbols-outlined icon-sm align-middle mr-1">error</span>
          {error}
        </p>
      )}
      <p className="mt-2 text-on-surface-variant text-[0.625rem] leading-snug">
        오늘 이후 날짜는 선택할 수 없으며, 기간은 최대 7일까지입니다.
      </p>
    </div>
  );
}

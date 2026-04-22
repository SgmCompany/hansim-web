'use client';

import { useState } from 'react';
import { formatDateToInput, getDaysDifference } from '@/src/utils/date';

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

  const goToNextMonth = () => {
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
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);

    if (selectingStart) {
      // 시작일 선택 중
      onStartDateChange(dateStr);
      
      // 종료일이 시작일보다 이전이면 종료일도 같이 변경
      if (clickedDate > currentEnd) {
        onEndDateChange(dateStr);
      }
      
      // 종료일과의 차이가 7일 초과면 자동 조정
      const diffDays = getDaysDifference(clickedDate, currentEnd);
      if (diffDays > 7) {
        const newEnd = new Date(clickedDate);
        newEnd.setDate(newEnd.getDate() + 7);
        onEndDateChange(formatDateToInput(newEnd));
      }
      
      setSelectingStart(false);
    } else {
      // 종료일 선택 중
      onEndDateChange(dateStr);
      
      // 종료일이 시작일보다 이전이면 시작일도 같이 변경
      if (clickedDate < currentStart) {
        onStartDateChange(dateStr);
      }
      
      // 시작일과의 차이가 7일 초과면 자동 조정
      const diffDays = getDaysDifference(currentStart, clickedDate);
      if (diffDays > 7) {
        const newStart = new Date(clickedDate);
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
    if (!date) return false;
    const dateStr = formatDateToInput(date);
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isStartDate = (date: Date | null): boolean => {
    if (!date) return false;
    return formatDateToInput(date) === startDate;
  };

  const isEndDate = (date: Date | null): boolean => {
    if (!date) return false;
    return formatDateToInput(date) === endDate;
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
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
    <div className="bg-surface-container-low rounded-2xl p-6">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-2 hover:bg-surface-container rounded-xl transition-colors"
          aria-label="이전 달"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            오늘
          </button>
          <span className="text-lg font-black text-on-surface">
            {viewYear}년 {monthNames[viewMonth]}
          </span>
        </div>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-surface-container rounded-xl transition-colors"
          aria-label="다음 달"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* 선택 모드 표시 */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setSelectingStart(true)}
          className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            selectingStart
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          시작일: {startDate}
        </button>
        <button
          type="button"
          onClick={() => setSelectingStart(false)}
          className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            !selectingStart
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          종료일: {endDate}
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-on-surface-variant py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const dateStr = formatDateToInput(date);
          const inRange = isDateInRange(date);
          const isStart = isStartDate(date);
          const isEnd = isEndDate(date);
          const isTodayDate = isToday(date);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDateClick(dateStr)}
              className={`
                aspect-square rounded-xl text-sm font-bold transition-all
                ${inRange ? 'bg-primary/10' : ''}
                ${isStart || isEnd ? 'bg-primary text-on-primary ring-2 ring-primary' : 'text-on-surface'}
                ${!inRange && !isStart && !isEnd ? 'hover:bg-surface-container' : ''}
                ${isTodayDate && !isStart && !isEnd ? 'ring-1 ring-primary/50' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 text-error text-sm font-semibold">
          <span className="material-symbols-outlined icon-sm align-middle mr-1">error</span>
          {error}
        </p>
      )}
      <p className="mt-3 text-on-surface-variant text-xs">최대 7일까지 선택 가능합니다.</p>
    </div>
  );
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 한심 요약 조회에서 선택·요청 가능한 가장 이른 날짜 (서비스 데이터 기준)
 */
export const MIN_SELECTABLE_SUMMARY_DATE = '2024-04-01';

/**
 * 오늘 날짜 반환
 */
export function getToday(): Date {
  return new Date();
}

/** YYYY-MM-DD 문자열 기준으로 a와 b 중 더 늦은 날 */
export function maxDateStr(a: string, b: string): string {
  return a >= b ? a : b;
}

export function clampDateStrToMinSummary(dateStr: string): string {
  return dateStr < MIN_SELECTABLE_SUMMARY_DATE ? MIN_SELECTABLE_SUMMARY_DATE : dateStr;
}

export function getMinSelectableSummaryYearMonth(): { year: number; monthIndex0: number } {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(MIN_SELECTABLE_SUMMARY_DATE);
  if (!m) return { year: 2024, monthIndex0: 3 };
  return { year: Number(m[1]), monthIndex0: Number(m[2]) - 1 };
}

/**
 * URL·상태용: 최소일·오늘·최대 7일·시작≤종료를 한 번에 맞춤
 */
export function normalizeSummaryDateRange(startStr: string, endStr: string): {
  start: string;
  end: string;
} {
  const today = formatDateToInput(getToday());
  let s = clampDateStrToMinSummary(startStr);
  let e = clampDateStrToMinSummary(endStr);

  if (s > e) {
    s = e;
  }
  e = e > today ? today : e;
  s = s > today ? today : s;
  if (s > e) {
    e = s;
  }

  let diff = getDaysDifference(new Date(s), new Date(e));
  if (diff > 7) {
    const endD = new Date(e);
    const newStartD = new Date(endD);
    newStartD.setDate(newStartD.getDate() - 7);
    s = maxDateStr(formatDateToInput(newStartD), MIN_SELECTABLE_SUMMARY_DATE);
    if (s > e) {
      s = e;
    }
    diff = getDaysDifference(new Date(s), new Date(e));
    if (diff > 7) {
      const startD = new Date(s);
      const newEndD = new Date(startD);
      newEndD.setDate(newEndD.getDate() + 7);
      const capped =
        formatDateToInput(newEndD) > today ? today : formatDateToInput(newEndD);
      e = capped < s ? s : capped;
    }
  }

  return { start: s, end: e };
}

/**
 * 두 날짜 사이의 일수 차이 계산
 */
export function getDaysDifference(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 날짜 범위 검증 (최대 7일)
 */
export function isValidDateRange(
  startDate: Date,
  endDate: Date,
): {
  valid: boolean;
  error?: string;
} {
  const todayStr = formatDateToInput(getToday());
  const startStr = formatDateToInput(startDate);
  const endStr = formatDateToInput(endDate);

  if (startStr < MIN_SELECTABLE_SUMMARY_DATE || endStr < MIN_SELECTABLE_SUMMARY_DATE) {
    return {
      valid: false,
      error: `조회 가능 기간은 ${MIN_SELECTABLE_SUMMARY_DATE.slice(0, 4)}년 4월 1일부터입니다.`,
    };
  }

  if (startStr > todayStr || endStr > todayStr) {
    return { valid: false, error: '오늘 이후 날짜는 선택할 수 없습니다.' };
  }

  if (startDate > endDate) {
    return { valid: false, error: '시작일은 종료일보다 이전이어야 합니다.' };
  }

  const daysDiff = getDaysDifference(startDate, endDate);
  if (daysDiff > 7) {
    return { valid: false, error: '최대 7일까지 선택 가능합니다.' };
  }

  return { valid: true };
}

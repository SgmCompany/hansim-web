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
 * 오늘 날짜 반환
 */
export function getToday(): Date {
  return new Date();
}

/**
 * 두 날짜 사이의 일수 차이 계산
 */
export function getDaysDifference(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 날짜 범위 검증 (최대 30일)
 */
export function isValidDateRange(startDate: Date, endDate: Date): {
  valid: boolean;
  error?: string;
} {
  if (startDate > endDate) {
    return { valid: false, error: '시작일은 종료일보다 이전이어야 합니다.' };
  }

  const daysDiff = getDaysDifference(startDate, endDate);
  if (daysDiff > 30) {
    return { valid: false, error: '최대 30일까지 선택 가능합니다.' };
  }

  return { valid: true };
}

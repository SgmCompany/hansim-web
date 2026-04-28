/**
 * 대한민국 최저임금 고시액 (정적 상수 — 연도 갱신 시 수정)
 * @see https://www.moel.go.kr/
 */
export const KOREA_MINIMUM_WAGE_2026 = {
  /** 적용 연도 */
  year: 2026,
  /** 시간당 최저임금 (원) */
  hourlyWon: 10_320,
  /**
   * 법정 월 금액 참고치 (원). 최저임금법 시행규칙 소정근로시간 월 209시간 적용 시.
   * 플레이 시간 환산에는 사용하지 않음 — 시급 × 분만 사용합니다.
   */
  monthlyStandardWon: 2_156_880,
  monthlyStandardHours: 209,
} as const;

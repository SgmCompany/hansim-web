import type { components } from '@/src/types/api.generated';

export type ProfileWorkType = NonNullable<components['schemas']['MyProfileResponse']['workType']>;

/**
 * 세전 연봉(원)을 시간당 환산할 때 가정하는 연간 총 근로시간.
 * 주 40시간 × 52주 — UI·각주 설명과 함께 유지할 것.
 */
export const ANNUAL_SALARY_STANDARD_WORK_HOURS = 2080;

/** 백엔드 `salaryAmount`(원) + 근무 유형 → 기회비용용 시간당 단가(원). */
export function hourlyWonFromSalaryProfile(workType: ProfileWorkType, salaryAmountWon: number): number | null {
  if (!Number.isFinite(salaryAmountWon) || salaryAmountWon <= 0) return null;
  switch (workType) {
    case 'PART_TIME':
      return salaryAmountWon;
    case 'NINE_TO_SIX':
    case 'FAIR_24H':
      return salaryAmountWon / ANNUAL_SALARY_STANDARD_WORK_HOURS;
    default:
      return null;
  }
}

export function getSalaryHourlyWonFromMe(
  me: components['schemas']['MyProfileResponse'] | undefined | null,
): number | null {
  if (me?.salaryAmount == null || me.salaryAmount <= 0) return null;
  const wt = me.workType;
  if (!wt) return null;
  return hourlyWonFromSalaryProfile(wt, me.salaryAmount);
}

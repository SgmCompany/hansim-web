import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';
import { ANNUAL_SALARY_STANDARD_WORK_HOURS } from '@/src/utils/salaryHourlyRate';

const wonFmt = new Intl.NumberFormat('ko-KR');

type Props = {
  /** 요약 페이지 등 페이지당 한 번만 쓸 때 여백 */
  className?: string;
  /** 근무 프로필 급여가 적용된 시간당 단가(원). 넘기면 해당 기준 안내를 함께 표시 */
  profileSalaryHourlyWon?: number | null;
};

/**
 * 최저임금·플레이 환산에 대한 안내 문구 (반복 카드에는 넣지 않고 상·하단에 한 블록으로 두는 것을 권장)
 */
export function HansimOpportunityFootnote({ className = '', profileSalaryHourlyWon }: Props) {
  if (profileSalaryHourlyWon != null && profileSalaryHourlyWon > 0 && Number.isFinite(profileSalaryHourlyWon)) {
    const hourlyRounded = Math.round(profileSalaryHourlyWon);
    return (
      <p
        className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}
      >
        금액 환산은 계정 근무 프로필에 입력한 급여(원)를 기준으로 합니다. 시급(알바)은 해당 금액을 그대로
        시간당 단가로 쓰고, 세전 연봉은 {wonFmt.format(ANNUAL_SALARY_STANDARD_WORK_HOURS)}시간(주
        40시간×52주)으로 나눈 시간당 약 {wonFmt.format(hourlyRounded)}원을 적용합니다. 미설정 시{' '}
        {KOREA_MINIMUM_WAGE_2026.year}년 최저임금 시급{' '}
        {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원과 같은 방식으로 계산합니다.
      </p>
    );
  }

  return (
    <p
      className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}
    >
      {KOREA_MINIMUM_WAGE_2026.year}년 최저임금 기준(시급 {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원).
      월 {wonFmt.format(KOREA_MINIMUM_WAGE_2026.monthlyStandardWon)}원은 월{' '}
      {KOREA_MINIMUM_WAGE_2026.monthlyStandardHours}
      시간 법정 환산일 뿐이며, 본 금액은 플레이 시간(초)을 시급으로 환산해 산출했습니다.
    </p>
  );
}

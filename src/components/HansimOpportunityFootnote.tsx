import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';
import { ANNUAL_SALARY_STANDARD_WORK_HOURS } from '@/src/utils/salaryHourlyRate';

const wonFmt = new Intl.NumberFormat('ko-KR');

type EconomicBasis = 'REGISTERED_SALARY' | 'MINIMUM_WAGE';

type Props = {
  /** 요약 페이지 등 페이지당 한 번만 쓸 때 여백 */
  className?: string;
  /** 백엔드 economicImpact 기준 안내 (있으면 우선) */
  serverEconomic?: {
    basis: EconomicBasis;
    hourlyRate: number;
  } | null;
  /**
   * 레거시: 서버 필드 없을 때만 사용 — 클라이언트에서 프로필로 계산한 시급(원)
   * @deprecated 서버 economicImpact 정상 시 불필요
   */
  profileSalaryHourlyWon?: number | null;
};

/**
 * 최저임금·플레이 환산에 대한 안내 문구 (반복 카드에는 넣지 않고 상·하단에 한 블록으로 두는 것을 권장)
 */
export function HansimOpportunityFootnote({
  className = '',
  serverEconomic,
  profileSalaryHourlyWon,
}: Props) {
  if (serverEconomic && serverEconomic.basis === 'REGISTERED_SALARY') {
    const hourly = Math.round(serverEconomic.hourlyRate);
    return (
      <p className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}>
        금액 환산은{' '}
        <strong className="font-semibold text-on-surface">조회를 요청한 계정(호출자)</strong>에 등록된 근무
        프로필 급여를 서버에서 반영한 참고치입니다. 피검색 소환사의 급여와는 무관합니다. 적용 시급 약{' '}
        {wonFmt.format(hourly)}원/시, 플레이 시간으로부터 손실액을 산출합니다.
      </p>
    );
  }

  if (serverEconomic && serverEconomic.basis === 'MINIMUM_WAGE') {
    const hourly = Math.round(serverEconomic.hourlyRate);
    return (
      <p className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}>
        금액 환산은 서버에서 정한 최저임금 기준 시급(약 {wonFmt.format(hourly)}원/시)을 적용합니다. 비로그인·미등록·학생·
        미취업 등 해당 시 적용됩니다. 플레이 시간으로부터 참고 손실액을 산출합니다.
      </p>
    );
  }

  if (profileSalaryHourlyWon != null && profileSalaryHourlyWon > 0 && Number.isFinite(profileSalaryHourlyWon)) {
    const hourlyRounded = Math.round(profileSalaryHourlyWon);
    return (
      <p className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}>
        금액 환산은 계정 근무 프로필에 입력한 급여(원)를 기준으로 합니다. 시급(알바)은 해당 금액을 그대로
        시간당 단가로 쓰고, 세전 연봉은 {wonFmt.format(ANNUAL_SALARY_STANDARD_WORK_HOURS)}시간(주
        40시간×52주)으로 나눈 시간당 약 {wonFmt.format(hourlyRounded)}원을 적용합니다. 미설정 시{' '}
        {KOREA_MINIMUM_WAGE_2026.year}년 최저임금 시급{' '}
        {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원과 같은 방식으로 계산합니다.
      </p>
    );
  }

  return (
    <p className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}>
      {KOREA_MINIMUM_WAGE_2026.year}년 최저임금 기준(시급 {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원).
      월 {wonFmt.format(KOREA_MINIMUM_WAGE_2026.monthlyStandardWon)}원은 월{' '}
      {KOREA_MINIMUM_WAGE_2026.monthlyStandardHours}
      시간 법정 환산일 뿐이며, 본 금액은 플레이 시간(초)을 시급으로 환산해 산출했습니다.
    </p>
  );
}

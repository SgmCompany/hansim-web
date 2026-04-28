import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';

const wonFmt = new Intl.NumberFormat('ko-KR');

type Props = {
  /** 요약 페이지 등 페이지당 한 번만 쓸 때 여백 */
  className?: string;
};

/**
 * 최저임금·플레이 환산에 대한 안내 문구 (반복 카드에는 넣지 않고 상·하단에 한 블록으로 두는 것을 권장)
 */
export function HansimOpportunityFootnote({ className = '' }: Props) {
  return (
    <p
      className={`text-[0.65rem] text-on-surface-variant leading-relaxed ${className}`.trim()}
    >
      {KOREA_MINIMUM_WAGE_2026.year}년 최저임금 기준(시급 {wonFmt.format(KOREA_MINIMUM_WAGE_2026.hourlyWon)}원). 월{' '}
      {wonFmt.format(KOREA_MINIMUM_WAGE_2026.monthlyStandardWon)}원은 월 {KOREA_MINIMUM_WAGE_2026.monthlyStandardHours}
      시간 법정 환산일 뿐이며, 본 금액은 플레이 시간(초)을 시급으로 환산해 산출했습니다.
    </p>
  );
}

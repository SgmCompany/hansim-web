/** HLS 총점 구간별 등급·톤 (NINE_TO_SIX 한심 톤) */
export type HlsTierDef = {
  min: number;
  max: number;
  emoji: string;
  label: string;
  /** 기본 한 줄 멘트 (등급 톤) */
  quote: string;
};

export const HLS_TIERS: readonly HlsTierDef[] = [
  { min: 0, max: 20, emoji: '😇', label: '모범현생인', quote: '오늘은 현생에 충실했군요' },
  { min: 21, max: 40, emoji: '😐', label: '평균', quote: '적당히 즐기셨네요' },
  { min: 41, max: 60, emoji: '😅', label: '한심 시작', quote: '퇴근 후 칼을 뽑으셨군요' },
  { min: 61, max: 80, emoji: '😤', label: '중증', quote: '내일 업무가 걱정되는 수준입니다' },
  { min: 81, max: 100, emoji: '💀', label: '한심 만렙', quote: '당신의 인생을 되돌아보세요' },
] as const;

export function getHlsTier(total: number): HlsTierDef {
  const t = Math.min(100, Math.max(0, Math.round(total)));
  const found = HLS_TIERS.find((x) => t >= x.min && t <= x.max);
  return found ?? HLS_TIERS[HLS_TIERS.length - 1]!;
}

export function formatHlsScoreRange(row: HlsTierDef): string {
  return `${row.min}~${row.max}`;
}

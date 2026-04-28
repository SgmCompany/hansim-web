import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';

/**
 * 플레이 시간(초)을 동일 시간 최저시급 근로라고 가정했을 때의 임금액(원, 내림).
 */
export function earningsWonAtMinimumWageFromSeconds2026(playSeconds: number): number {
  if (!Number.isFinite(playSeconds) || playSeconds <= 0) return 0;
  const s = Math.floor(playSeconds);
  return Math.floor((s * KOREA_MINIMUM_WAGE_2026.hourlyWon) / 3600);
}

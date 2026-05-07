import { KOREA_MINIMUM_WAGE_2026 } from '@/src/constants/koreaMinimumWage';

/**
 * 플레이 시간(초)을 동일 시간 최저시급 근로라고 가정했을 때의 임금액(원, 내림).
 */
export function earningsWonAtMinimumWageFromSeconds2026(playSeconds: number): number {
  if (!Number.isFinite(playSeconds) || playSeconds <= 0) return 0;
  const s = Math.floor(playSeconds);
  return Math.floor((s * KOREA_MINIMUM_WAGE_2026.hourlyWon) / 3600);
}

/** 플레이 시간(초) × 시급(원) 환산 임금액(원, 내림). */
export function earningsWonFromHourlyRate(playSeconds: number, hourlyWon: number): number {
  if (!Number.isFinite(playSeconds) || playSeconds <= 0) return 0;
  if (!Number.isFinite(hourlyWon) || hourlyWon <= 0) return 0;
  const s = Math.floor(playSeconds);
  return Math.floor((s * hourlyWon) / 3600);
}

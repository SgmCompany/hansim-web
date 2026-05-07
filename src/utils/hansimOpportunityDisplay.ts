import type { components } from '@/src/types/api.generated';
import {
  earningsWonAtMinimumWageFromSeconds2026,
  earningsWonFromHourlyRate,
} from '@/src/utils/opportunityCost';
import {
  formatPlayDurationSeconds,
  resolveTotalPlaySeconds,
} from '@/src/utils/totalPlayMinutes';

type Player = components['schemas']['Player'];

export type HansimOpportunityDisplay = {
  hlsTotal: number | undefined;
  totalPlaySeconds: number;
  playDurationLabel: string;
  opportunityWon: number;
  /** 프로필 급여로 환산한 경우 표시용 시간당 단가(원, 반올림). 없으면 최저임금 기준 */
  hourlyBasisDisplayWon?: number;
};

/** 한심·플레이·금액 환산 표시에 필요한 값 (UI 공통). */
export function getHansimOpportunityDisplay(
  player: Player,
  options?: { hourlyWonBasis?: number | null },
): HansimOpportunityDisplay {
  const totalPlaySeconds = resolveTotalPlaySeconds(player);
  const hlsTotal = player.hls?.total;
  const hourly = options?.hourlyWonBasis;
  const useProfile =
    hourly != null && Number.isFinite(hourly) && hourly > 0;

  const opportunityWon = useProfile
    ? earningsWonFromHourlyRate(totalPlaySeconds, hourly)
    : earningsWonAtMinimumWageFromSeconds2026(totalPlaySeconds);

  return {
    hlsTotal: typeof hlsTotal === 'number' ? hlsTotal : undefined,
    totalPlaySeconds,
    playDurationLabel: formatPlayDurationSeconds(totalPlaySeconds),
    opportunityWon,
    hourlyBasisDisplayWon: useProfile ? Math.round(hourly) : undefined,
  };
}

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
type EconomicImpact = components['schemas']['EconomicImpactResponse'];

function parseServerEconomicImpact(player: Player): EconomicImpact | null {
  const e = player.economicImpact;
  if (e == null || typeof e !== 'object') return null;
  const { hourlyRate, totalCost, basis } = e;
  if (
    typeof hourlyRate !== 'number' ||
    typeof totalCost !== 'number' ||
    !Number.isFinite(hourlyRate) ||
    !Number.isFinite(totalCost)
  ) {
    return null;
  }
  if (basis !== 'REGISTERED_SALARY' && basis !== 'MINIMUM_WAGE') return null;
  return e;
}

export type HansimOpportunityDisplay = {
  hlsTotal: number | undefined;
  totalPlaySeconds: number;
  playDurationLabel: string;
  opportunityWon: number;
  /** 표시용 시간당 단가(원, 반올림). 서버 또는 클라이언트 환산 */
  hourlyBasisDisplayWon?: number;
  economicBasis?: EconomicImpact['basis'];
  /** true면 totalCost·hourlyRate는 백엔드 economicImpact */
  fromApiEconomicImpact: boolean;
};

/**
 * 한심·플레이·금액 환산 표시에 필요한 값 (UI 공통).
 * 1) Player.economicImpact(호출자 급여 기준, 서버 산출) 우선
 * 2) 없으면 hourlyWonBasis 클라이언트 환산
 * 3) 없으면 프론트 최저임금 상수 환산
 */
export function getHansimOpportunityDisplay(
  player: Player,
  options?: { hourlyWonBasis?: number | null },
): HansimOpportunityDisplay {
  const totalPlaySeconds = resolveTotalPlaySeconds(player);
  const hlsTotal = player.hls?.total;

  const server = parseServerEconomicImpact(player);
  if (server) {
    const opportunityWon = Math.max(0, Math.floor(Number(server.totalCost)));
    const hourlyBasisDisplayWon = Math.round(server.hourlyRate);
    return {
      hlsTotal: typeof hlsTotal === 'number' ? hlsTotal : undefined,
      totalPlaySeconds,
      playDurationLabel: formatPlayDurationSeconds(totalPlaySeconds),
      opportunityWon,
      hourlyBasisDisplayWon,
      economicBasis: server.basis,
      fromApiEconomicImpact: true,
    };
  }

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
    economicBasis: undefined,
    fromApiEconomicImpact: false,
  };
}

import type { components } from '@/src/types/api.generated';
import { earningsWonAtMinimumWageFromSeconds2026 } from '@/src/utils/opportunityCost';
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
};

/** 한심·플레이·최저시급 환산 표시에 필요한 값 (UI 공통). */
export function getHansimOpportunityDisplay(player: Player): HansimOpportunityDisplay {
  const totalPlaySeconds = resolveTotalPlaySeconds(player);
  const hlsTotal = player.hls?.total;

  return {
    hlsTotal: typeof hlsTotal === 'number' ? hlsTotal : undefined,
    totalPlaySeconds,
    playDurationLabel: formatPlayDurationSeconds(totalPlaySeconds),
    opportunityWon: earningsWonAtMinimumWageFromSeconds2026(totalPlaySeconds),
  };
}

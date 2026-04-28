import type { components } from '@/src/types/api.generated';

type Player = components['schemas']['Player'];

const QUEUE_KEYS: (keyof components['schemas']['Queues'])[] = ['solo', 'flex', 'normal', 'aram'];

/**
 * API가 준 총 플레이 시간(초)을 해석합니다.
 * - `player.totalPlaySeconds`가 있으면 우선 (스펙상 필수)
 * - 없으면 큐별 `totalPlaySeconds` 합
 */
export function resolveTotalPlaySeconds(player: Player): number {
  if (typeof player.totalPlaySeconds === 'number' && player.totalPlaySeconds >= 0) {
    return player.totalPlaySeconds;
  }
  let sum = 0;
  for (const k of QUEUE_KEYS) {
    const q = player.queues[k];
    if (q && typeof q.totalPlaySeconds === 'number' && q.totalPlaySeconds >= 0) {
      sum += q.totalPlaySeconds;
    }
  }
  return sum;
}

/** 표시용: "3시간 5분" / "42분" (초는 분으로 내림해 표시) */
export function formatPlayDurationSeconds(totalSeconds: number): string {
  return formatPlayDurationMinutes(Math.floor(Math.max(0, totalSeconds) / 60));
}

/** 표시용: "3시간 5분" / "42분" */
export function formatPlayDurationMinutes(totalMinutes: number): string {
  const m = Math.max(0, Math.floor(totalMinutes));
  if (m === 0) return '0분';
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest}분`;
  if (rest === 0) return `${h}시간`;
  return `${h}시간 ${rest}분`;
}

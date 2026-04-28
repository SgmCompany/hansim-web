import type { components } from '@/src/types/api.generated';

export type HlsDetailKey =
  | 'volume'
  | 'result'
  | 'lateNight'
  | 'weekend'
  | 'session'
  | 'losingStreak'
  | 'tilt';

export type HlsDetailRowView = {
  key: HlsDetailKey;
  emoji: string;
  label: string;
  score: number;
  max: number;
};

type HlsDetail = components['schemas']['HlsDetail'];

/** 부분 점수 항목 — API 필드명·표시 순서·상한 */
export const HLS_DETAIL_ROWS: readonly {
  key: HlsDetailKey;
  emoji: string;
  label: string;
  max: number;
}[] = [
  { key: 'volume', emoji: '🎮', label: '플레이량', max: 30 },
  { key: 'result', emoji: '💀', label: '결과', max: 20 },
  { key: 'lateNight', emoji: '🌙', label: '심야 접속', max: 15 },
  { key: 'weekend', emoji: '📅', label: '주말 낭비', max: 10 },
  { key: 'session', emoji: '⏱️', label: '연속 세션', max: 10 },
  { key: 'losingStreak', emoji: '📉', label: '연패', max: 10 },
  { key: 'tilt', emoji: '😤', label: '분노재큐', max: 5 },
] as const;

function pickScore(detail: HlsDetail | undefined, key: HlsDetailKey): number {
  if (!detail) return 0;
  const v = detail[key];
  return typeof v === 'number' && v >= 0 ? v : 0;
}

export function getHlsDetailRowViews(detail: HlsDetail | undefined): HlsDetailRowView[] {
  return HLS_DETAIL_ROWS.map((row) => ({
    ...row,
    score: Math.min(row.max, pickScore(detail, row.key)),
  }));
}

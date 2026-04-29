import type { components } from '@/src/types/api.generated';
import { getProfileIconUrl, getRankKoreanName, getTierKoreanName } from '@/src/lib/ddragon';

type Player = components['schemas']['Player'];

/** 한심왕 보드에 표시하는 최대 인원 (HLS 순) */
export const HANSIM_KING_TOP_N = 3;

export type HlsLeaderboardRow = {
  rank: number;
  riotId: string;
  tierLabel: string;
  lp: number;
  /** HLS 총점 — 미포함 시 null */
  hlsTotal: number | null;
  avatarUrl: string;
};

function hlsSortKey(player: Player): number {
  const t = player.hls?.total;
  return typeof t === 'number' && Number.isFinite(t) ? t : -Infinity;
}

function soloTierLabel(player: Player): string {
  if (!player.soloRank) return '언랭크';
  return `${getTierKoreanName(player.soloRank.tier)} ${getRankKoreanName(player.soloRank.rank)}`.trim();
}

/**
 * 배치 요약 응답의 소환사 목록을 HLS 총점 내림차순으로 정렬해 한심왕 보드 행으로 만듭니다.
 * 상위 {@link HANSIM_KING_TOP_N}명만 반환합니다.
 * 동점 시 riotId 문자열 순으로 안정 정렬합니다.
 */
export function buildHlsLeaderboardRows(
  players: Player[],
  ddragonVersion: string | undefined,
): HlsLeaderboardRow[] {
  const sorted = [...players].sort((a, b) => {
    const d = hlsSortKey(b) - hlsSortKey(a);
    if (d !== 0) return d;
    return a.riotId.localeCompare(b.riotId, 'ko');
  });

  const top = sorted.slice(0, HANSIM_KING_TOP_N);

  return top.map((p, i) => {
    const raw = p.hls?.total;
    const hlsTotal = typeof raw === 'number' && Number.isFinite(raw) ? raw : null;
    return {
      rank: i + 1,
      riotId: p.riotId,
      tierLabel: soloTierLabel(p),
      lp: p.soloRank?.lp ?? 0,
      hlsTotal,
      avatarUrl: getProfileIconUrl(p.profileIconId, ddragonVersion),
    };
  });
}

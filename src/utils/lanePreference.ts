import type { components } from '@/src/types/api.generated';
import { getLolPositionKorean } from '@/src/utils/lolPosition';

type Champion = components['schemas']['Champion'];

export type LanePreferenceSummary = {
  /** 한글 라인 (탑·정글·미드·바텀·서포트) */
  primaryLabel: string;
  /** 주 라인으로 집계된 판 수 */
  gamesOnPrimary: number;
  /** 상위 챔피언 통계 판 수 합 (API topChampions 기준) */
  totalGames: number;
  /** totalGames 대비 주 라인 비중 0~1 */
  ratio: number;
};

/**
 * 조회 기간 `topChampions`만으로 포지션별 판 수를 합산해 가장 많이 플레이한 라인을 고릅니다.
 * 포지션 정보가 없는 챔피언 판은 주 라인 비율 분모에는 포함되나 분자 후보에서는 제외합니다.
 */
export function summarizeLaneFromChampions(
  champions: Champion[] | undefined | null,
): LanePreferenceSummary | null {
  if (!champions?.length) return null;

  const counts = new Map<string, { labelKo: string; games: number }>();
  let totalGames = 0;

  for (const c of champions) {
    totalGames += c.games;
    const raw = c.topPosition?.trim();
    if (!raw) continue;
    const key = raw.toUpperCase();
    const labelKo = getLolPositionKorean(raw) ?? raw;
    const prev = counts.get(key);
    if (prev) prev.games += c.games;
    else counts.set(key, { labelKo, games: c.games });
  }

  if (counts.size === 0 || totalGames <= 0) return null;

  const ranked = [...counts.entries()].sort((a, b) => {
    if (b[1].games !== a[1].games) return b[1].games - a[1].games;
    return a[0].localeCompare(b[0]);
  });

  const top = ranked[0][1];
  const gamesOnPrimary = top.games;
  const ratio = gamesOnPrimary / totalGames;

  return {
    primaryLabel: top.labelKo,
    gamesOnPrimary,
    totalGames,
    ratio,
  };
}

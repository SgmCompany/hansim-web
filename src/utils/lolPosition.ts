/** API `Champion.topPosition` (TOP / JUNGLE / MID / BOTTOM / UTILITY) → 한글 라인 표기 */
const POSITION_KO: Record<string, string> = {
  TOP: '탑',
  JUNGLE: '정글',
  MID: '미드',
  BOTTOM: '바텀',
  UTILITY: '서포트',
};

export function getLolPositionKorean(position: string | undefined | null): string | undefined {
  if (position == null || position === '') return undefined;
  const key = position.trim().toUpperCase();
  return POSITION_KO[key] ?? position;
}

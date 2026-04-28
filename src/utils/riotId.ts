/** 한국 서버에서 흔한 기본 태그 (닉만 입력 시 자동 부착) */
export const DEFAULT_RIOT_TAGLINE = 'KR1';

/**
 * 검색창에 입력한 한 줄을 Riot ID 후보로 정규화합니다.
 * - `#`가 없고 `-`도 없으면 → `닉네임#DEFAULT_RIOT_TAGLINE`
 * - `#`가 있으면 → `#` 주변 공백만 정리
 * - `-`만 있는 형식(예: 페이커-KR1)은 API 호환을 위해 그대로 둡니다.
 */
export function normalizeSummonerSearchToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  if (trimmed.includes('#')) {
    return trimmed.replace(/\s*#\s*/g, '#');
  }

  if (trimmed.includes('-')) {
    return trimmed;
  }

  return `${trimmed}#${DEFAULT_RIOT_TAGLINE}`;
}

export function normalizeSummonerSearchInput(commaSeparated: string): string[] {
  return commaSeparated
    .split(',')
    .map((t) => normalizeSummonerSearchToken(t))
    .filter((s) => s.length > 0);
}

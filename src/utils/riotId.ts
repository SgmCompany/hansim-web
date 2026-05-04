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

/** 대소문자 무시 후 첫 번째 형태만 유지(순서 보존). 배치 검색·URL 중복으로 인한 키 충돌 방지 */
export function dedupeSummonerRiotIds(tokens: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

/** 쉼표 구분 입력 → 정규화 후 동일 계정 중복 제거 */
export function normalizeSummonerSearchInput(commaSeparated: string): string[] {
  const raw = commaSeparated
    .split(',')
    .map((t) => normalizeSummonerSearchToken(t))
    .filter((s) => s.length > 0);
  return dedupeSummonerRiotIds(raw);
}

/**
 * 한 줄 입력을 API `{ gameName, tagLine }` 형식으로 변환합니다.
 * - `이름#태그`, 태그 생략 시 기본 태그 부착(`normalizeSummonerSearchToken` 규칙)
 * - `이름-태그`(하이픈) 형식도 허용 (마지막 `-` 기준 분리)
 */
export function parseRiotIdForApi(raw: string): { gameName: string; tagLine: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.includes('#')) {
    const compact = trimmed.replace(/\s*#\s*/g, '#');
    const idx = compact.indexOf('#');
    const gameName = compact.slice(0, idx).trim();
    const tagLine = compact.slice(idx + 1).trim() || DEFAULT_RIOT_TAGLINE;
    if (!gameName) return null;
    return { gameName, tagLine };
  }

  if (trimmed.includes('-')) {
    const idx = trimmed.lastIndexOf('-');
    const gameName = trimmed.slice(0, idx).trim();
    const tagLine = trimmed.slice(idx + 1).trim() || DEFAULT_RIOT_TAGLINE;
    if (!gameName) return null;
    return { gameName, tagLine };
  }

  const normalized = normalizeSummonerSearchToken(trimmed);
  if (!normalized) return null;
  const idx = normalized.indexOf('#');
  if (idx === -1) return null;
  const gameName = normalized.slice(0, idx).trim();
  const tagLine = normalized.slice(idx + 1).trim() || DEFAULT_RIOT_TAGLINE;
  if (!gameName) return null;
  return { gameName, tagLine };
}

/** 분리 입력 필드 → API body */
export function riotIdFromParts(
  gameName: string,
  tagLine: string,
): { gameName: string; tagLine: string } | null {
  const gn = gameName.trim();
  const tl = tagLine.trim() || DEFAULT_RIOT_TAGLINE;
  if (!gn) return null;
  return { gameName: gn, tagLine: tl };
}

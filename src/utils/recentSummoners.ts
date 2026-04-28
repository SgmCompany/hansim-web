/** localStorage 키 (로그인 불필요, 브라우저 재시작 후 유지) */
export const RECENT_SUMMONERS_STORAGE_KEY = 'hansim.recent-summoners';

export const RECENT_SUMMONERS_MAX = 10;

/** 중복 판별용 (대소문자·# 주변 공백 무시) */
export function recentSummonerDedupeKey(riotId: string): string {
  return riotId.trim().toLowerCase().replace(/\s*#\s*/g, '#');
}

export function loadRecentSummoners(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SUMMONERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  } catch {
    return [];
  }
}

export function saveRecentSummoners(ids: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECENT_SUMMONERS_STORAGE_KEY, JSON.stringify(ids));
}

/**
 * 검색에 사용된 정규화된 Riot ID 목록을 최근 검색에 반영합니다.
 * - 배열 앞쪽(먼저 입력한 닉)이 리스트 상단에 오도록 역순으로 삽입합니다.
 * - 동일 키는 제거 후 최상단으로 올립니다.
 * - 최대 RECENT_SUMMONERS_MAX 유지
 */
export function addRecentSummonersFromSearch(normalizedNames: string[]): string[] {
  const uniqueIncoming = normalizedNames.filter((s) => s.length > 0);
  if (uniqueIncoming.length === 0) return loadRecentSummoners();

  let list = loadRecentSummoners();
  for (const name of [...uniqueIncoming].reverse()) {
    const key = recentSummonerDedupeKey(name);
    list = list.filter((x) => recentSummonerDedupeKey(x) !== key);
    list = [name, ...list];
  }
  list = list.slice(0, RECENT_SUMMONERS_MAX);
  saveRecentSummoners(list);
  return list;
}

export function removeRecentSummoner(riotId: string): string[] {
  const key = recentSummonerDedupeKey(riotId);
  const next = loadRecentSummoners().filter((x) => recentSummonerDedupeKey(x) !== key);
  saveRecentSummoners(next);
  return next;
}

/** 쉼표로 구분된 입력에서 현재 편집 중인 마지막 토큰(닉/태그 일부) */
export function getActiveSummonerSearchToken(input: string): string {
  const segment = input.split(',').pop() ?? '';
  return segment.trim();
}

function gameNameFromRiotId(riotId: string): string {
  if (riotId.includes('#')) return riotId.split('#')[0] ?? riotId;
  if (riotId.includes('-')) return riotId.split('-')[0] ?? riotId;
  return riotId;
}

/**
 * 최근 검색 목록에서 현재 토큰과 부분 일치하는 Riot ID 추천 (최대 limit개).
 * 입력과 동일한 항목(중복 키)은 제외합니다.
 */
export function suggestRecentsForToken(recents: string[], token: string, limit = 6): string[] {
  const t = token.trim().toLowerCase();
  if (!t) return [];

  const tokenKey = recentSummonerDedupeKey(token);

  const rank = (r: string): number => {
    const g = gameNameFromRiotId(r).toLowerCase();
    const full = r.toLowerCase();
    if (g.startsWith(t)) return 0;
    if (full.startsWith(t)) return 1;
    return 2;
  };

  return recents
    .filter((r) => recentSummonerDedupeKey(r) !== tokenKey)
    .filter((r) => {
      const g = gameNameFromRiotId(r).toLowerCase();
      const full = r.toLowerCase();
      return g.includes(t) || full.includes(t);
    })
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .slice(0, limit);
}

/** 마지막 쉼표 토큰을 선택한 Riot ID로 교체 */
export function applySummonerSuggestionToInput(input: string, suggestion: string): string {
  const parts = input.split(',');
  parts[parts.length - 1] = ` ${suggestion.trim()}`;
  return parts
    .map((p, i) => (i === 0 ? p.trimStart() : p.trim()))
    .join(', ')
    .trim();
}

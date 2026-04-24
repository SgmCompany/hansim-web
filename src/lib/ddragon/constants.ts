/**
 * Data Dragon 상수
 * Riot Games의 정적 데이터 CDN
 */

export const DDRAGON_LANG = 'ko_KR';
export const DDRAGON_CDN_BASE = 'https://ddragon.leagueoflegends.com/cdn';

/**
 * 챔피언 스퀘어 이미지 URL
 * @param championKey 챔피언 키 (예: "Ahri", "MasterYi")
 * @param version Data Dragon 버전 (예: "15.8.1")
 */
export function getChampionImageUrl(championKey: string, version?: string): string {
  const ver = version || '14.1.1'; // fallback
  return `${DDRAGON_CDN_BASE}/${ver}/img/champion/${championKey}.png`;
}

/**
 * 프로필 아이콘 URL
 * @param iconId 프로필 아이콘 ID
 * @param version Data Dragon 버전 (예: "15.8.1")
 */
export function getProfileIconUrl(iconId: number, version?: string): string {
  const ver = version || '14.1.1'; // fallback
  return `${DDRAGON_CDN_BASE}/${ver}/img/profileicon/${iconId}.png`;
}

/**
 * 챔피언 스플래시 아트 URL
 * @param championKey 챔피언 키
 * @param skinNum 스킨 번호 (0 = 기본)
 */
export function getChampionSplashUrl(championKey: string, skinNum: number = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championKey}_${skinNum}.jpg`;
}

/**
 * 아이템 이미지 URL
 * @param itemId 아이템 ID
 * @param version Data Dragon 버전 (예: "15.8.1")
 */
export function getItemImageUrl(itemId: number, version?: string): string {
  const ver = version || '14.1.1'; // fallback
  return `${DDRAGON_CDN_BASE}/${ver}/img/item/${itemId}.png`;
}

/**
 * 소환사 주문 이미지 URL
 * @param spellKey 스펠 키 (예: "SummonerFlash")
 * @param version Data Dragon 버전 (예: "15.8.1")
 */
export function getSummonerSpellImageUrl(spellKey: string, version?: string): string {
  const ver = version || '14.1.1'; // fallback
  return `${DDRAGON_CDN_BASE}/${ver}/img/spell/${spellKey}.png`;
}

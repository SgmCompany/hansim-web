/**
 * 게임 데이터 한국어 변환
 * Data Dragon을 사용하지 않는 백엔드 데이터의 한국어 매핑
 */

/**
 * 티어를 한국어로 변환
 */
export function getTierKoreanName(tier: string): string {
  const tierMap: Record<string, string> = {
    IRON: '아이언',
    BRONZE: '브론즈',
    SILVER: '실버',
    GOLD: '골드',
    PLATINUM: '플래티넘',
    EMERALD: '에메랄드',
    DIAMOND: '다이아몬드',
    MASTER: '마스터',
    GRANDMASTER: '그랜드마스터',
    CHALLENGER: '챌린저',
    UNRANKED: '언랭크',
  };

  return tierMap[tier.toUpperCase()] || tier;
}

/**
 * 랭크를 한국어로 변환 (I, II, III, IV)
 */
export function getRankKoreanName(rank: string): string {
  const rankMap: Record<string, string> = {
    I: 'I',
    II: 'II',
    III: 'III',
    IV: 'IV',
  };

  return rankMap[rank.toUpperCase()] || rank;
}

/**
 * 큐 타입을 한국어로 변환
 */
export function getQueueKoreanName(queueType: string): string {
  const queueMap: Record<string, string> = {
    RANKED_SOLO_5x5: '솔로 랭크',
    RANKED_FLEX_SR: '자유 5:5 랭크',
    RANKED_FLEX_TT: '자유 3:3 랭크',
    NORMAL: '일반 게임',
    ARAM: '칼바람 나락',
    // 필요 시 추가
  };

  return queueMap[queueType] || queueType;
}

/**
 * 티어 색상 반환 (Tailwind class)
 */
export function getTierColor(tier: string): string {
  const tierColorMap: Record<string, string> = {
    CHALLENGER: 'text-[#F4C873]',
    GRANDMASTER: 'text-[#FF6B6B]',
    MASTER: 'text-[#B794F6]',
    DIAMOND: 'text-[#6BB6FF]',
    EMERALD: 'text-[#50C878]',
    PLATINUM: 'text-[#4EC9B0]',
    GOLD: 'text-[#FFD700]',
    SILVER: 'text-[#B8B8B8]',
    BRONZE: 'text-[#CD7F32]',
    IRON: 'text-[#4D4D4D]',
    UNRANKED: 'text-outline',
  };

  return tierColorMap[tier.toUpperCase()] || 'text-outline';
}

/**
 * 전체 티어 + 랭크 한국어 문자열
 * @example "DIAMOND II" → "다이아몬드 II"
 */
export function getFullRankKoreanName(tier: string, rank: string): string {
  return `${getTierKoreanName(tier)} ${getRankKoreanName(rank)}`;
}

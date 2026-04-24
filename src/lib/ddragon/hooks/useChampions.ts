import { useQuery } from '@tanstack/react-query';
import { DDRAGON_CDN_BASE, DDRAGON_LANG } from '../constants';
import { useLatestVersion } from './useVersion';

interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
  };
}

interface ChampionsResponse {
  data: Record<string, ChampionData>;
  type: string;
  version: string;
}

/**
 * Data Dragon에서 챔피언 목록 조회
 * @returns 챔피언 ID를 키로 하는 챔피언 데이터 맵
 */
export function useChampions() {
  const { data: version } = useLatestVersion();

  return useQuery({
    queryKey: ['ddragon', 'champions', DDRAGON_LANG, version],
    queryFn: async (): Promise<ChampionsResponse> => {
      if (!version) throw new Error('Data Dragon 버전을 확인할 수 없습니다.');
      
      const response = await fetch(`${DDRAGON_CDN_BASE}/${version}/data/${DDRAGON_LANG}/champion.json`);
      if (!response.ok) {
        throw new Error('챔피언 데이터를 불러올 수 없습니다.');
      }
      return response.json();
    },
    enabled: !!version, // 버전이 로드된 후에만 실행
    staleTime: 24 * 60 * 60 * 1000, // 24시간
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7일
  });
}

/**
 * 챔피언 ID로 챔피언 이름 조회 (한국어)
 * @param championId 챔피언 ID (숫자)
 * @param championsData useChampions()에서 반환된 데이터
 */
export function getChampionNameById(
  championId: number,
  championsData?: ChampionsResponse
): string {
  if (!championsData) return `Champion ${championId}`;

  const champion = Object.values(championsData.data).find(
    (champ) => parseInt(champ.key) === championId
  );

  return champion?.name || `Champion ${championId}`;
}

/**
 * 챔피언 ID로 챔피언 키 조회 (이미지 URL용)
 * @param championId 챔피언 ID (숫자)
 * @param championsData useChampions()에서 반환된 데이터
 */
export function getChampionKeyById(
  championId: number,
  championsData?: ChampionsResponse
): string {
  if (!championsData) return '';

  const champion = Object.values(championsData.data).find(
    (champ) => parseInt(champ.key) === championId
  );

  return champion?.id || '';
}

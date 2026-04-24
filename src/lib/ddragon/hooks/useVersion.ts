import { useQuery } from '@tanstack/react-query';

/**
 * Data Dragon 최신 버전 조회
 * @returns 최신 버전 문자열 (예: "15.8.1")
 */
export function useLatestVersion() {
  return useQuery({
    queryKey: ['ddragon', 'version'],
    queryFn: async (): Promise<string> => {
      const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      if (!response.ok) {
        throw new Error('Data Dragon 버전을 불러올 수 없습니다.');
      }
      const versions: string[] = await response.json();
      return versions[0]; // 첫 번째 값이 최신 버전
    },
    staleTime: 24 * 60 * 60 * 1000, // 24시간 (버전은 자주 변하지 않음)
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7일
    retry: 3,
  });
}

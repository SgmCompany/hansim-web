import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '../client';
import { summonerKeys } from '../queryKeys';

/**
 * 소환사 데이터 타입
 */
export interface Summoner {
  id: string;
  name: string;
  level: number;
  profileIconId: number;
  region: string;
}

export interface SummonerStats {
  wins: number;
  losses: number;
  winRate: number;
  kda: number;
  tier: string;
  rank: string;
  lp: number;
}

/**
 * 소환사 정보 조회
 */
export function useSummoner(summonerName: string, enabled = true) {
  return useQuery({
    queryKey: summonerKeys.detail(summonerName),
    queryFn: () => apiGet<Summoner>(`/api/v1/summoner/${summonerName}`),
    enabled: enabled && !!summonerName,
  });
}

/**
 * 소환사 통계 조회
 */
export function useSummonerStats(summonerName: string, enabled = true) {
  return useQuery({
    queryKey: summonerKeys.stats(summonerName),
    queryFn: () => apiGet<SummonerStats>(`/api/v1/summoner/${summonerName}/stats`),
    enabled: enabled && !!summonerName,
  });
}

/**
 * 소환사 검색 (멀티)
 */
export function useSearchSummoners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (summonerNames: string[]) =>
      apiPost<Summoner[]>('/api/v1/summoner/search', { names: summonerNames }),
    onSuccess: (data) => {
      // 각 소환사 데이터를 캐시에 저장
      data.forEach((summoner) => {
        queryClient.setQueryData(summonerKeys.detail(summoner.name), summoner);
      });
    },
  });
}

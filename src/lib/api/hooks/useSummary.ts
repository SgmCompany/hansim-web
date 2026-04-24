import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import { getSummary, getBatchSummary } from '../services/summaryService';
import { summonerKeys } from '../queryKeys';
import type { components } from '@/src/types/api.generated';

type SummaryResponse = components['schemas']['SummaryResponse'];
type SummaryRequestQuery = components['schemas']['SummaryRequestQuery'];
type BatchSummaryRequest = components['schemas']['BatchSummaryRequest'];
type BatchSummaryResponse = components['schemas']['BatchSummaryResponse'];

/**
 * 다중 소환사 한심 summary 조회 (Batch API 사용)
 * @param riotIds Riot ID 배열 (페이커#KR1 또는 페이커-KR1 형식)
 * @param startDate 조회 시작일 (yyyy-MM-dd)
 * @param endDate 조회 종료일 (yyyy-MM-dd)
 */
export function useBatchSummary(riotIds: string[], startDate?: string, endDate?: string) {
  const request: BatchSummaryRequest = {
    riotIds,
    startDate,
    endDate,
  };

  return useQuery({
    queryKey: summonerKeys.batchSummary(riotIds, startDate, endDate),
    queryFn: () => getBatchSummary(request),
    enabled: riotIds.length > 0 && riotIds.length <= 5,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    gcTime: 10 * 60 * 1000, // 10분 가비지 컬렉션
  });
}

/**
 * 여러 소환사의 한심 summary를 조회하는 훅 (개별 API 호출 방식)
 * @deprecated useBatchSummary를 사용하세요
 * @param riotIds Riot ID 배열 (이름-태그 형식)
 * @param query 날짜 범위 쿼리 파라미터
 */
export function useMultipleSummaries(riotIds: string[], query?: SummaryRequestQuery) {
  return useQueries({
    queries: riotIds.map((riotId) => ({
      queryKey: summonerKeys.summary(riotId, query),
      queryFn: () => getSummary(riotId, query),
      enabled: riotIds.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  }) as UseQueryResult<SummaryResponse, Error>[];
}

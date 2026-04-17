import { apiGet, apiPost } from '../client';
import type { paths, components } from '@/src/types/api.generated';

type SummaryResponse = components['schemas']['SummaryResponse'];
type SummaryRequestQuery = components['schemas']['SummaryRequestQuery'];
type BatchSummaryRequest = components['schemas']['BatchSummaryRequest'];
type BatchSummaryResponse = components['schemas']['BatchSummaryResponse'];

/**
 * 한심 summary 조회
 * @param riotId Riot ID (이름-태그 형식, 예: 페이커-KR1)
 * @param query 날짜 범위 쿼리 파라미터
 */
export async function getSummary(
  riotId: string,
  query?: SummaryRequestQuery,
): Promise<SummaryResponse> {
  return apiGet<SummaryResponse>(`/api/v1/hansim/summary/${encodeURIComponent(riotId)}`, {
    params: query,
  });
}

/**
 * 다중 소환사 한심 summary 조회 (Batch API)
 * @param request Batch 요청 (riotIds, startDate, endDate)
 * @returns Batch 응답 (period, periodStr, players)
 */
export async function getBatchSummary(
  request: BatchSummaryRequest,
): Promise<BatchSummaryResponse> {
  return apiPost<BatchSummaryResponse>('/api/v1/hansim/summary/batch', request);
}

/**
 * 여러 소환사의 summary를 병렬로 조회 (개별 API 호출 방식 - 레거시)
 * @deprecated getBatchSummary를 사용하세요
 * @param riotIds Riot ID 배열
 * @param query 날짜 범위 쿼리 파라미터
 */
export async function getMultipleSummaries(
  riotIds: string[],
  query?: SummaryRequestQuery,
): Promise<SummaryResponse[]> {
  const promises = riotIds.map((riotId) => getSummary(riotId, query));
  return Promise.all(promises);
}

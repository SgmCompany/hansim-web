/**
 * 로그인 사용자 프로필·소환사 연동 API
 * 스키마: openapi/openapi.json → src/types/api.generated.ts
 */

import type { components } from '@/src/types/api.generated';
import { apiDelete, apiGet, apiPut } from '../client';

export type MyProfileResponse = components['schemas']['MyProfileResponse'];
export type LinkSummonerRequest = components['schemas']['LinkSummonerRequest'];
export type UpdateProfileRequest = components['schemas']['UpdateProfileRequest'];

export async function getMe() {
  return apiGet<MyProfileResponse>('/api/v1/users/me');
}

/**
 * 소득 입력값 → API `salaryAmount`(원 단위).
 * - 연봉형: 화면 만원 정수 → × 10_000
 * - 알바 시급: 이미 원 단위 정수
 */
export function buildUpdateProfileRequest(
  workType: UpdateProfileRequest['workType'],
  incomeParsed: number | null,
): UpdateProfileRequest {
  const body: UpdateProfileRequest = { workType };
  if (workType === 'NINE_TO_SIX' || workType === 'FAIR_24H') {
    if (incomeParsed !== null) body.salaryAmount = incomeParsed * 10000;
  } else if (workType === 'PART_TIME') {
    if (incomeParsed !== null) body.salaryAmount = incomeParsed;
  }
  return body;
}

export async function updateProfile(body: UpdateProfileRequest) {
  return apiPut<void>('/api/v1/users/me/profile', body);
}

export async function linkSummoner(body: LinkSummonerRequest) {
  return apiPut<void>('/api/v1/users/me/summoner', body);
}

export async function unlinkSummoner() {
  return apiDelete<void>('/api/v1/users/me/summoner');
}

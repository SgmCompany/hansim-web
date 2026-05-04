/**
 * 로그인 사용자 프로필·소환사 연동 API
 * 스키마: openapi/openapi.json → src/types/api.generated.ts
 */

import type { components } from '@/src/types/api.generated';
import { apiDelete, apiGet, apiPut } from '../client';

export type MyProfileResponse = components['schemas']['MyProfileResponse'];
export type LinkSummonerRequest = components['schemas']['LinkSummonerRequest'];

export async function getMe() {
  return apiGet<MyProfileResponse>('/api/v1/users/me');
}

export async function linkSummoner(body: LinkSummonerRequest) {
  return apiPut<void>('/api/v1/users/me/summoner', body);
}

export async function unlinkSummoner() {
  return apiDelete<void>('/api/v1/users/me/summoner');
}

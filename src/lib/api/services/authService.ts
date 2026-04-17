/**
 * 인증 서비스
 * 백엔드 API와의 인증 관련 통신 로직
 */

import { apiPost, apiDelete } from '../client';
import type { paths } from '@/src/types/api.generated';

// API 타입 추출
type GoogleLoginRequest =
  paths['/api/v1/auth/google']['post']['requestBody']['content']['application/json'];
type GoogleLoginResponse =
  paths['/api/v1/auth/google']['post']['responses']['200']['content']['*/*'];

/**
 * Google OAuth 로그인/회원가입
 *
 * @param googleToken - Google ID Token (JWT)
 * @returns 백엔드 JWT
 *
 * Endpoint: POST /api/v1/auth/google
 * Request: { googleToken: string }
 * Response: { accessToken: string }
 */
export async function loginWithGoogle(googleToken: string) {
  const response = await apiPost<GoogleLoginResponse>(
    '/api/v1/auth/google',
    { googleToken } satisfies GoogleLoginRequest,
    { skipAuth: true }, // 로그인 시에는 인증 불필요
  );

  return response;
}

/**
 * 로그아웃
 *
 * Note: 백엔드가 stateless JWT 방식이므로 서버 호출 불필요
 * 클라이언트 측에서만 토큰 삭제 처리
 */
export async function logout() {
  // Stateless 방식이므로 서버 호출 없음
  return { success: true };
}

/**
 * 회원탈퇴
 *
 * Endpoint: DELETE /api/v1/auth/withdraw
 * Response: 204 No Content
 * Security: Bearer JWT 필요
 */
export async function deleteAccount() {
  await apiDelete<void>('/api/v1/auth/withdraw');

  return { success: true };
}

/**
 * 현재 사용자 정보 조회
 *
 * Note: 현재 백엔드 API에 이 엔드포인트가 없음
 * NextAuth 세션의 user 정보를 사용하거나, 필요시 백엔드에 추가 요청
 */
export async function getCurrentUser() {
  // 백엔드 API에 /api/v1/user/me 엔드포인트가 없으므로
  // NextAuth 세션 정보를 사용
  return null;
}

/**
 * 인증 서비스
 * 백엔드 API와의 인증 관련 통신 로직
 */

import { apiPost, apiDelete, apiGet } from '../client';

/**
 * Google OAuth 로그인/회원가입
 * 
 * @param idToken - Google ID Token
 * @param accessToken - Google Access Token
 * @returns 백엔드 JWT 및 사용자 정보
 * 
 * TODO: 백엔드 API 스펙에 맞게 수정 필요
 * Endpoint: POST /api/v1/auth/google
 * Request: { idToken, accessToken }
 * Response: { accessToken, user }
 */
export async function loginWithGoogle(idToken: string, accessToken: string) {
  // TODO: 실제 API 연동
  // return apiPost('/api/v1/auth/google', { idToken, accessToken });
  
  // 임시 응답
  return {
    accessToken: 'backend-jwt-token',
    user: {
      id: '1',
      email: 'user@example.com',
      name: '사용자',
      profileImage: null,
    },
  };
}

/**
 * 로그아웃
 * 
 * TODO: 백엔드 API 스펙에 맞게 수정 필요
 * Endpoint: POST /api/v1/auth/logout (선택적)
 * 
 * Note: 백엔드가 stateless라면 이 API는 불필요할 수 있음
 */
export async function logout() {
  // TODO: 실제 API 연동 (선택적)
  // return apiPost('/api/v1/auth/logout');
  
  return { success: true };
}

/**
 * 회원탈퇴
 * 
 * @returns 탈퇴 성공 여부
 * 
 * TODO: 백엔드 API 스펙에 맞게 수정 필요
 * Endpoint: DELETE /api/v1/user/me
 * Response: { success: boolean }
 */
export async function deleteAccount() {
  // TODO: 실제 API 연동
  // return apiDelete('/api/v1/user/me');
  
  return { success: true };
}

/**
 * 현재 사용자 정보 조회
 * 
 * TODO: 백엔드 API 스펙에 맞게 수정 필요
 * Endpoint: GET /api/v1/user/me
 * Response: { id, email, name, profileImage, createdAt }
 */
export async function getCurrentUser() {
  // TODO: 실제 API 연동
  // return apiGet('/api/v1/user/me');
  
  // 임시 응답
  return {
    id: '1',
    email: 'user@example.com',
    name: '사용자',
    profileImage: null,
    createdAt: new Date().toISOString(),
  };
}

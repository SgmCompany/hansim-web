import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import * as authService from '../services/authService';

import type { paths } from '@/src/types/api.generated';

/**
 * 백엔드 API 타입
 */
type AuthResponse = paths['/api/v1/auth/google']['post']['responses']['200']['content']['*/*'];

/**
 * 회원가입/로그인 (Google)
 * Google OAuth 완료 후 백엔드에 ID Token 전송
 */
export function useGoogleAuth() {
  return useMutation({
    mutationFn: async (googleToken: string) => {
      return authService.loginWithGoogle(googleToken);
    },
    onSuccess: (data: AuthResponse) => {
      // 백엔드에서 받은 JWT를 로컬에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('hansim_access_token', data.accessToken);
      }
    },
    onError: (error) => {
      console.error('백엔드 로그인 실패:', error);
    },
  });
}

/**
 * 로그아웃
 * 백엔드에 로그아웃 알림 (선택적)
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 백엔드 로그아웃 (선택적)
      await authService.logout();
      
      // 클라이언트 측 로그아웃
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      // 모든 캐시 초기화
      queryClient.clear();
      
      // 홈으로 리다이렉트
      window.location.href = '/';
    },
  });
}

/**
 * 회원탈퇴
 * 백엔드에 회원탈퇴 요청 (deleted_at 설정)
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authService.deleteAccount();
    },
    onSuccess: async () => {
      console.log('회원탈퇴 성공');
      
      // 캐시 초기화
      queryClient.clear();
      
      // 클라이언트 토큰 삭제
      await signOut({ redirect: false });
      
      // 홈으로 리다이렉트
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('회원탈퇴 실패:', error);
    },
  });
}

/**
 * 현재 사용자 정보 조회
 */
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
}

export function useCurrentUser() {
  return useMutation({
    mutationFn: async () => {
      return authService.getCurrentUser();
    },
  });
}

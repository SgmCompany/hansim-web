/**
 * 로그아웃 유틸리티
 * 클라이언트 측 토큰 완전 삭제
 */

import { signOut } from 'next-auth/react';

export async function logout() {
  // 1. NextAuth 세션 삭제
  await signOut({ redirect: false });

  // 2. 로컬 스토리지 정리 (혹시 모를 잔여 데이터)
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }

  // 3. 쿠키 정리 (NextAuth 관련)
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('next-auth') || name.startsWith('__Secure-next-auth')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  }

  // 4. 홈으로 리다이렉트
  window.location.href = '/';
}

/**
 * 회원탈퇴
 * 서버에서 deleted_at 설정 후 클라이언트 토큰 삭제
 */
export async function deleteAccount() {
  try {
    // 1. 서버에 회원탈퇴 요청 (deleted_at 설정)
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('회원탈퇴 요청 실패');
    }

    // 2. 클라이언트 토큰 완전 삭제
    await logout();

    return { success: true };
  } catch (error) {
    console.error('회원탈퇴 오류:', error);
    return { success: false, error };
  }
}

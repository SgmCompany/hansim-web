'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navigation } from '@/src/components/Navigation';
import { Footer } from '@/src/components/Footer';
import { logout, deleteAccount } from '@/src/lib/auth/logout';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navigation />
        <main className="flex-grow flex items-center justify-center px-4 pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
          <div className="animate-pulse text-on-surface-variant">로딩 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAccount();
      
      if (!result.success) {
        alert('회원탈퇴 처리 중 오류가 발생했습니다.');
        setIsDeleting(false);
        setShowConfirm(false);
      }
      // 성공 시 logout()에서 자동으로 홈으로 리다이렉트
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      alert('회원탈퇴 처리 중 오류가 발생했습니다.');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-on-surface mb-6 sm:mb-8">
          계정 설정
        </h1>

        <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">프로필 정보</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || '사용자'}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <p className="text-lg font-bold text-on-surface mb-1">{session.user?.name}</p>
              <p className="text-on-surface-variant">{session.user?.email}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/15">
            <button
              onClick={logout}
              className="px-6 py-3 bg-surface-container-high hover:bg-surface-container rounded-full font-bold transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-error">위험 구역</h2>
          <p className="text-on-surface-variant mb-6">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-3 bg-error-container text-error rounded-full font-bold hover:scale-105 transition-all"
            >
              회원탈퇴
            </button>
          ) : (
            <div className="bg-error-container/20 p-6 rounded-xl">
              <p className="text-error font-bold mb-4">정말로 계정을 삭제하시겠습니까?</p>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="min-h-11 px-6 py-3 bg-error text-on-error rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? '처리 중...' : '확인'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="min-h-11 px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-full font-bold transition-colors disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

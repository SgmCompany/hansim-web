'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SummonerLinkSection } from '@/src/components/SummonerLinkSection';
import { Navigation } from '@/src/components/Navigation';
import { Footer } from '@/src/components/Footer';
import { logout, deleteAccount } from '@/src/lib/auth/logout';

const WITHDRAW_CONFIRM_PHRASE = '협곡 졸업';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [withdrawPhraseInput, setWithdrawPhraseInput] = useState('');

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
    if (withdrawPhraseInput.trim() !== WITHDRAW_CONFIRM_PHRASE) return;

    setIsDeleting(true);

    try {
      const result = await deleteAccount();
      
      if (!result.success) {
        alert('회원탈퇴 처리 중 오류가 발생했습니다.');
        setIsDeleting(false);
        setShowConfirm(false);
        setWithdrawPhraseInput('');
      }
      // 성공 시 logout()에서 자동으로 홈으로 리다이렉트
    } catch (error) {
      console.error('회원탈퇴 오류:', error);
      alert('회원탈퇴 처리 중 오류가 발생했습니다.');
      setIsDeleting(false);
      setShowConfirm(false);
      setWithdrawPhraseInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-on-surface mb-6 sm:mb-8">
          계정 설정
        </h1>

        <SummonerLinkSection />

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

          <details className="group pt-6 border-t border-outline-variant/15 list-none [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface select-none">
              <span
                className="material-symbols-outlined text-lg transition-transform duration-200 group-open:rotate-90"
                aria-hidden
              >
                chevron_right
              </span>
              <span>로그아웃</span>
            </summary>
            <div className="mt-4 pl-8">
              <button
                type="button"
                onClick={logout}
                className="px-6 py-3 bg-surface-container-high hover:bg-surface-container rounded-full font-bold transition-colors"
              >
                로그아웃
              </button>
            </div>
          </details>
        </div>

        <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4 text-error">위험 구역</h2>
          <p className="text-on-surface-variant mb-6">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => {
                setWithdrawPhraseInput('');
                setShowConfirm(true);
              }}
              className="px-6 py-3 bg-error-container text-error rounded-full font-bold hover:scale-105 transition-all"
            >
              회원탈퇴
            </button>
          ) : (
            <div className="bg-error-container/20 p-6 rounded-xl space-y-5">
              <div>
                <p className="text-error font-bold mb-2">정말로 협곡을 떠나시겠습니까?</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  아래 입력란에{' '}
                  <span className="font-extrabold text-on-surface tabular-nums">{WITHDRAW_CONFIRM_PHRASE}</span>를
                  정확히 입력한 뒤, 회원탈퇴를 진행할 수 있습니다.
                </p>
              </div>
              <div>
                <label htmlFor="withdraw-phrase" className="sr-only">
                  확인 문구 입력 ({WITHDRAW_CONFIRM_PHRASE})
                </label>
                <input
                  id="withdraw-phrase"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={isDeleting}
                  placeholder={WITHDRAW_CONFIRM_PHRASE}
                  value={withdrawPhraseInput}
                  onChange={(e) => setWithdrawPhraseInput(e.target.value)}
                  aria-invalid={
                    withdrawPhraseInput.length > 0 &&
                    withdrawPhraseInput.trim() !== WITHDRAW_CONFIRM_PHRASE
                  }
                  className="w-full px-5 py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 font-medium outline-none focus:ring-2 focus:ring-error/40 disabled:opacity-50"
                />
                {withdrawPhraseInput.length > 0 &&
                  withdrawPhraseInput.trim() !== WITHDRAW_CONFIRM_PHRASE && (
                    <p className="mt-2 text-sm font-medium text-error">문구가 일치하지 않습니다.</p>
                  )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeleting || withdrawPhraseInput.trim() !== WITHDRAW_CONFIRM_PHRASE
                  }
                  className="min-h-11 px-6 py-3 bg-error text-on-error rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isDeleting ? '처리 중...' : '회원탈퇴 완료'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setWithdrawPhraseInput('');
                  }}
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

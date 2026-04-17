'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/src/components/Navigation';
import { Footer } from '@/src/components/Footer';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest p-10 rounded-[3rem] no-line-boundary text-center">
            <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-error text-3xl">
                error
              </span>
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-on-surface mb-4">
              로그인 실패
            </h1>
            
            <p className="text-on-surface-variant mb-8">
              {error === 'OAuthSignin' && '인증 서비스 연결에 실패했습니다.'}
              {error === 'OAuthCallback' && '인증 정보 확인에 실패했습니다.'}
              {error === 'OAuthCreateAccount' && '계정 생성에 실패했습니다.'}
              {error === 'EmailCreateAccount' && '이메일 계정 생성에 실패했습니다.'}
              {error === 'Callback' && '인증 콜백 처리에 실패했습니다.'}
              {error === 'OAuthAccountNotLinked' && '이미 다른 방법으로 가입된 이메일입니다.'}
              {error === 'EmailSignin' && '이메일 전송에 실패했습니다.'}
              {error === 'CredentialsSignin' && '로그인 정보가 올바르지 않습니다.'}
              {error === 'SessionRequired' && '로그인이 필요합니다.'}
              {!error && '알 수 없는 오류가 발생했습니다.'}
            </p>
            
            <Link
              href="/auth/signin"
              className="inline-block px-10 py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-extrabold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              다시 시도
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-surface">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant">로딩 중...</div>
        </main>
        <Footer />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

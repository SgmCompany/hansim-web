'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

type NavigationProps = {
  isHomePage?: boolean;
};

export function Navigation({ isHomePage = false }: NavigationProps) {
  const { data: session, status } = useSession();

  const maxWidth = isHomePage ? 'max-w-screen-2xl' : 'max-w-6xl';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl no-line tonal-layering">
      <div className="pt-[env(safe-area-inset-top,0px)]">
        <div
          className={`flex justify-between items-center gap-2 sm:gap-4 min-h-14 sm:min-h-20 h-14 sm:h-20 px-4 sm:px-6 lg:px-8 w-full ${maxWidth} mx-auto`}
        >
          <Link
            href="/"
            className="group relative text-lg sm:text-2xl font-black tracking-tighter text-primary shrink-0 min-h-11 flex items-center rounded-xl px-2 -mx-2 transition-all duration-200 hover:bg-primary-container/45 hover:text-primary-dim hover:shadow-[0_4px_20px_-4px_rgba(0,106,53,0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
          >
            <span className="relative inline-block">
              한심지수
              <span
                className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[3px] origin-left scale-x-0 rounded-full bg-primary opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"
                aria-hidden
              />
            </span>
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 flex-1">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse shrink-0" />
            ) : session ? (
              <div className="flex items-center gap-1 sm:gap-3 shrink-0 flex-wrap justify-end">
                <Link
                  href="/account"
                  className="min-h-11 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-primary rounded-full transition-all duration-200 hover:bg-primary-container/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                >
                  마이페이지
                </Link>
                <Link
                  href="/account"
                  className="group min-h-11 min-w-11 p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-primary-container/55 hover:shadow-[0_6px_24px_-8px_rgba(0,106,53,0.45)] hover:ring-2 hover:ring-primary/20 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="계정 설정(마이페이지)"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || '사용자'}
                      className="w-8 h-8 rounded-full ring-0 transition-[box-shadow,transform] duration-200 group-hover:ring-2 group-hover:ring-primary/40"
                    />
                  ) : (
                    <span
                      className={`material-symbols-outlined transition-colors duration-200 group-hover:text-primary ${isHomePage ? 'text-primary' : 'text-on-surface'}`}
                    >
                      account_circle
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="min-h-11 inline-flex items-center justify-center px-4 sm:px-6 py-2.5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-bold text-xs sm:text-sm shadow-md shadow-primary/25 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/35 hover:brightness-[1.06] active:scale-[0.98] active:brightness-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 shrink-0"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

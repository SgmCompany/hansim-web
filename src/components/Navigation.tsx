'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logout } from '@/src/lib/auth/logout';

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
            className="text-lg sm:text-2xl font-black tracking-tighter text-primary shrink-0 min-h-11 flex items-center"
          >
            한심지수
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 flex-1">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse shrink-0" />
            ) : session ? (
              <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={logout}
                  className="min-h-11 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  className="min-h-11 min-w-11 p-2 hover:bg-zinc-100/50 rounded-full transition-all flex items-center justify-center"
                  aria-label="계정"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || '사용자'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span
                      className={`material-symbols-outlined ${isHomePage ? 'text-primary' : 'text-on-surface'}`}
                    >
                      account_circle
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="min-h-11 inline-flex items-center justify-center px-4 sm:px-6 py-2.5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-bold text-xs sm:text-sm hover:scale-105 transition-all shrink-0"
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

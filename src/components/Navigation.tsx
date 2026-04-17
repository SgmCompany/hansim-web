'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logout } from '@/src/lib/auth/logout';

type NavigationProps = {
  currentPage?: 'home' | 'leaderboard' | 'multi';
  isHomePage?: boolean;
};

export function Navigation({ currentPage = 'home', isHomePage = false }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 검색 로직 구현
      console.log('Search:', searchQuery);
    }
  };

  const maxWidth = isHomePage ? 'max-w-screen-2xl' : 'max-w-6xl';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl no-line tonal-layering">
      <div className={`flex justify-between items-center px-8 h-20 w-full ${maxWidth} mx-auto`}>
        {/* Logo & Menu */}
        {isHomePage ? (
          <>
            <div className="text-2xl font-black tracking-tighter text-primary">한심지수</div>
            <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-tight">
              <Link href="/" className="text-primary font-extrabold border-b-4 border-primary pb-1">
                홈
              </Link>
              <Link
                href="/leaderboard"
                className="text-zinc-500 font-medium hover:text-zinc-900 transition-all"
              >
                리더보드
              </Link>
              <Link
                href="/multi"
                className="text-zinc-500 font-medium hover:text-zinc-900 transition-all"
              >
                멀티검색
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
              한심지수
            </Link>
            <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-tight">
              <Link
                href="/"
                className={
                  currentPage === 'home'
                    ? 'text-primary font-extrabold border-b-4 border-primary pb-1'
                    : 'text-zinc-500 font-medium hover:text-zinc-900 transition-all'
                }
              >
                홈
              </Link>
              <Link
                href="/leaderboard"
                className={
                  currentPage === 'leaderboard'
                    ? 'text-primary font-extrabold border-b-4 border-primary pb-1'
                    : 'text-zinc-500 font-medium hover:text-zinc-900 transition-all'
                }
              >
                리더보드
              </Link>
              <Link
                href="/multi"
                className={
                  currentPage === 'multi'
                    ? 'text-primary font-extrabold border-b-4 border-primary pb-1'
                    : 'text-zinc-500 font-medium hover:text-zinc-900 transition-all'
                }
              >
                한심대결
              </Link>
            </div>
          </div>
        )}

        {/* Search & Account */}
        <div className="flex items-center gap-4">
          {!isHomePage && (
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="bg-surface-container-low rounded-full px-6 py-2.5 flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="용쿠리몽"
                  className="bg-transparent border-none focus:ring-0 text-sm font-semibold w-32 md:w-48 outline-none"
                />
              </div>
            </form>
          )}

          {status === 'loading' ? (
            <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                로그아웃
              </button>
              <button
                type="button"
                className="p-2 hover:bg-zinc-100/50 rounded-full transition-all"
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
              className="px-6 py-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-bold text-sm hover:scale-105 transition-all"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

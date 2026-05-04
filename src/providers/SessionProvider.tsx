'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { HANSIM_ACCESS_TOKEN_KEY } from '@/src/lib/auth/accessTokenStorage';

function AccessTokenSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) return;
    try {
      localStorage.setItem(HANSIM_ACCESS_TOKEN_KEY, session.accessToken);
    } catch {
      /* Storage 불가 환경 무시 */
    }
  }, [session?.accessToken, status]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AccessTokenSync>{children}</AccessTokenSync>
    </SessionProvider>
  );
}

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { loginWithGoogle } from '@/src/lib/api/services/authService';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && account?.id_token) {
        try {
          // 백엔드에 Google ID Token 전송
          const backendAuth = await loginWithGoogle(account.id_token);

          // 백엔드 JWT를 account에 임시 저장 (jwt 콜백에서 사용)
          account.backend_jwt = backendAuth.accessToken;

          return true;
        } catch (error) {
          console.error('백엔드 로그인 실패:', error);
          return false;
        }
      }

      return true;
    },
    async session({ session, token }) {
      // 세션에 추가 정보 포함
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }

      // Google OAuth 토큰
      if (account?.access_token) {
        token.googleAccessToken = account.access_token;
      }
      if (account?.id_token) {
        token.googleIdToken = account.id_token;
      }

      // 백엔드 JWT (실제 API 인증에 사용)
      if (account?.backend_jwt) {
        token.accessToken = account.backend_jwt;
      }

      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7일
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut({ token }) {
      // 로그아웃 시 클라이언트 측 토큰 완전 삭제
      // 서버는 stateless이므로 별도 처리 불필요
    },
  },
});

export { handler as GET, handler as POST };

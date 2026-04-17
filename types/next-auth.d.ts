import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string; // 백엔드 JWT (실제 API 인증용)
    googleAccessToken?: string; // Google OAuth Access Token
    googleIdToken?: string; // Google OAuth ID Token
  }
}

declare module "next-auth" {
  interface Account {
    backend_jwt?: string; // 백엔드 JWT 임시 저장용
  }
}

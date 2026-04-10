import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 에러가 있으면 에러 페이지로
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?error=${error}`, request.url)
    );
  }

  // NextAuth의 실제 콜백으로 리다이렉트
  const nextAuthCallbackUrl = new URL('/api/auth/callback/google', request.url);
  if (code) nextAuthCallbackUrl.searchParams.set('code', code);
  if (state) nextAuthCallbackUrl.searchParams.set('state', state);

  return NextResponse.redirect(nextAuthCallbackUrl);
}

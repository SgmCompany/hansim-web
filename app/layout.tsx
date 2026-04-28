import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { AuthProvider } from '@/src/providers/SessionProvider';
import { QueryProvider } from '@/src/providers/QueryProvider';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'block',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hansim.site'),
  title: '한심지수 - HanSim Level Score, HLS',
  description: '당신의 한심지수를 알아보세요. League of Legends 전적 분석 서비스',
  openGraph: {
    title: '한심지수 - HanSim Level Score, HLS',
    description: '당신의 한심지수를 알아보세요. League of Legends 전적 분석 서비스',
    url: '/',
    siteName: '한심지수',
    locale: 'ko_KR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5f6f7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* 초기 렌더링 시 깜빡임 방지 */
          html {
            background-color: #f5f6f7;
            color: #2c2f30;
          }
          body {
            opacity: 0;
            animation: fadeIn 0.1s ease-in forwards;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `,
          }}
        />
      </head>
      <body className={`${manrope.variable} antialiased bg-surface text-on-surface`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

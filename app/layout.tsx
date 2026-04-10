import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuthProvider } from "@/src/providers/SessionProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "한심지수 - Playful Precision Analytics",
  description: "당신의 협곡 실력을 정밀 분석합니다. League of Legends 전적 분석 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} antialiased bg-surface text-on-surface`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

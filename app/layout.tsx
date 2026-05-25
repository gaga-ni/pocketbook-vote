import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '6.3 선거 포켓북',
  description: '우리 동네 후보자 공약, 한눈에 비교하세요. 2026 제9회 전국동시지방선거',
  openGraph: {
    title: '6.3 선거 포켓북',
    description: '우리 동네 후보자 공약, 한눈에 비교하세요. 2026 제9회 전국동시지방선거',
    url: 'https://pocketbook-vote.vercel.app',
    siteName: '6.3 선거 포켓북',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '6.3 선거 포켓북 - 우리 동네 후보자 공약 비교',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6.3 선거 포켓북',
    description: '우리 동네 후보자 공약, 한눈에 비교하세요.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

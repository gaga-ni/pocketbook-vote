import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pocketbook-vote.vercel.app'),
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
        <footer style={{ background: '#111111' }} className="px-6 py-8 md:px-8 md:py-10">
          {/* Logo */}
          <img src="/logo_white.svg" alt="6.3 선거 포켓북" height="36" className="w-auto" style={{ marginBottom: '16px' }} />

          {/* Description */}
          <p className="text-[14px] font-normal" style={{ lineHeight: '1.6', marginBottom: '24px' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              본 서비스는 유권자의 알 권리를 위해 선관위 공개 데이터를 기반으로 제작된 비영리 정보 제공 서비스로,{' '}
            </span>
            <span style={{ color: '#ffffff' }}>
              특정 후보자나 정당을 지지하거나 반대하지 않습니다.
            </span>
          </p>

          {/* Bottom row */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>
                데이터 출처: 중앙선거관리위원회, 공공데이터포털
              </span>
              <span className="text-[12px] font-normal" style={{ color: 'rgba(255,255,255,0.8)' }}>
                © 2026 votecompare.xyz
              </span>
            </div>
            <a href="mailto:rlarkk5@gmail.com" aria-label="문의하기">
              <img
                src="/icon_mail.svg"
                alt="문의하기"
                width="32"
                height="32"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

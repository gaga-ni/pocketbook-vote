import RegionSelect from './components/RegionSelect';

function getDday(): number {
  const election = new Date('2026-06-03T00:00:00+09:00');
  const now = new Date();
  const diffMs = election.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function HomePage() {
  const dday = getDday();

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-canvas flex-1 px-4 py-8 md:px-8 md:py-16">
        <div className="max-w-[1200px] mx-auto">

          {/* Logo + subtitle */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="6.3 선거 포켓북" height="44" className="w-auto" />
          <p
            className="text-[12px] font-normal leading-[20px]"
            style={{ color: '#5e5e5e', marginTop: '4px' }}
          >
          </p>

          {/* D-day pill */}
          <div style={{ marginTop: '30px' }}>
            <span
              className="inline-flex items-center rounded-full text-on-dark text-[14px] font-medium leading-[16px]"
              style={{ background: '#000000', padding: '6px 12px' }}
            >
              선거일까지 D-{dday}
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="text-[22px] font-bold leading-[32px] text-ink"
            style={{ marginTop: '10px', marginBottom: '20px' }}
          >
            우리 동네 후보자 공약, 한 눈에 비교하세요.
          </h1>

          {/* Region select card */}
          <div
            className="bg-canvas rounded-2xl p-4 max-w-[480px]"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 16px 0px' }}
          >
            <RegionSelect />
          </div>

        </div>
      </section>

      {/* ── Black promo band ── */}
      <section className="bg-primary text-on-dark px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[18px] font-bold leading-[32px] mb-3">
            아직 투표가 서툰 당신을 위해
          </h2>
          <p className="text-[14px] font-normal leading-[24px] text-mute">
            우리동네 후보자들의 공약을 한 눈에 비교하세요.
            나의 소중한 한 표가 우리 동네를 바꿉니다.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary text-on-dark px-4 py-8 md:px-8 border-t border-black-elevated">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-1">
          <p className="text-[14px] font-normal leading-[20px]">6.3 선거 포켓북</p>
          <p className="text-[12px] font-normal leading-[20px] text-mute">
            2026년 6월 3일 제9회 전국동시지방선거
          </p>
        </div>
      </footer>

    </div>
  );
}

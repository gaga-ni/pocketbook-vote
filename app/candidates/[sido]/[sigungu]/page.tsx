import Link from 'next/link';
import { fetchCandidatesByType } from '@/app/lib/nec-api';
import CandidateListClient from './CandidateListClient';

type TabType = '3' | '4' | '11';

export default async function CandidatePage({
  params,
  searchParams,
}: {
  params: Promise<{ sido: string; sigungu: string }>;
  searchParams: Promise<{ compare?: string; sgTypecode?: string }>;
}) {
  const [{ sido: encodedSido, sigungu: encodedSigungu }, sp] = await Promise.all([
    params,
    searchParams,
  ]);
  const sido = decodeURIComponent(encodedSido);
  const sigungu = decodeURIComponent(encodedSigungu);

  const initialCompare =
    sp.compare && sp.sgTypecode
      ? { cnddtId: sp.compare, sgTypecode: sp.sgTypecode as TabType }
      : undefined;

  const [type3, type4all, type11] = await Promise.all([
    fetchCandidatesByType(sido, 3),
    fetchCandidatesByType(sido, 4),
    fetchCandidatesByType(sido, 11),
  ]);

  // Filter 구시군의장 candidates to the selected sigungu
  const type4 = type4all.filter((c) => c.sggName === sigungu);

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <nav className="sticky top-0 z-20 bg-canvas border-b border-canvas-soft px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas-soft text-ink text-[18px] flex-shrink-0"
            aria-label="뒤로"
          >
            ←
          </Link>
          <h1 className="text-[20px] font-bold leading-[28px] text-ink truncate">{sido} {sigungu}</h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" aria-label="홈으로" className="flex-shrink-0 ml-3">
          <img src="/icon_home.svg" alt="홈으로" width="28" height="28" />
        </Link>
      </nav>

      <CandidateListClient
        sido={sido}
        sigungu={sigungu}
        type3={type3}
        type4={type4}
        type11={type11}
        initialCompare={initialCompare}
      />
    </div>
  );
}

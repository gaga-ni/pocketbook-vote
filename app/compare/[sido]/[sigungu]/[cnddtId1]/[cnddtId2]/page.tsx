import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findCandidateWithType, fetchPledges } from '@/app/lib/nec-api';
import ComparisonClient from './ComparisonClient';

export default async function ComparePage({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string; cnddtId1: string; cnddtId2: string }>;
}) {
  const { sido: encodedSido, sigungu: encodedSigungu, cnddtId1, cnddtId2 } = await params;
  const sido = decodeURIComponent(encodedSido);

  const [r1, r2] = await Promise.all([
    findCandidateWithType(sido, cnddtId1),
    findCandidateWithType(sido, cnddtId2),
  ]);

  if (!r1.candidate || !r2.candidate) notFound();

  const { candidate: cand1, sgTypecode: type1 } = r1;
  const { candidate: cand2, sgTypecode: type2 } = r2;

  const [pledges1, pledges2] = await Promise.all([
    fetchPledges(cnddtId1, type1),
    fetchPledges(cnddtId2, type2),
  ]);

  const listUrl = `/candidates/${encodedSido}/${encodedSigungu}`;

  return (
    <div className="flex flex-col min-h-screen bg-canvas">

      {/* ── Nav bar ── */}
      <nav className="sticky top-0 z-20 bg-canvas border-b border-canvas-soft px-4 md:px-8 py-4 flex items-center gap-3">
        <Link
          href={listUrl}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas-soft text-ink text-[18px] flex-shrink-0"
          aria-label="목록으로"
        >
          ←
        </Link>
        <h1 className="text-[20px] font-bold leading-[28px] text-ink">공약 비교</h1>
      </nav>

      {/* ── Headers + pledges (client, manages removed state) ── */}
      <ComparisonClient
        pledges1={pledges1}
        pledges2={pledges2}
        cand1={cand1}
        cand2={cand2}
        sgTypecode1={type1}
        sgTypecode2={type2}
        encodedSido={encodedSido}
        encodedSigungu={encodedSigungu}
        cnddtId1={cnddtId1}
        cnddtId2={cnddtId2}
      />

      {/* ── Footer ── */}
      <footer className="bg-primary text-on-dark px-4 md:px-8 py-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
          <p className="text-[14px] font-normal text-mute">6.3 선거 포켓북</p>
          <Link
            href={listUrl}
            className="inline-flex items-center justify-center bg-canvas text-ink text-[16px] font-medium leading-[20px] px-6 py-3 rounded-full w-fit"
          >
            ← 후보 목록으로
          </Link>
        </div>
      </footer>

    </div>
  );
}

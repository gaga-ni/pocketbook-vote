import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  findCandidateWithType,
  fetchPledges,
  getElectionLabel,
  formatBirthdayDot,
} from '@/app/lib/nec-api';
import { getPartyStyle } from '@/app/lib/partyColors';
import { getPledgeCategory } from '@/app/lib/categoryMap';
import CategoryChip from '@/app/components/CategoryChip';
import ProfilePhotoSection from '@/app/components/ProfilePhotoSection';
import BackButton from '@/app/components/BackButton';
import PledgeSection from './PledgeSection';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string; cnddtId: string }>;
}) {
  const { sido: encodedSido, sigungu: encodedSigungu, cnddtId } = await params;
  const sido = decodeURIComponent(encodedSido);

  const { candidate, sgTypecode } = await findCandidateWithType(sido, cnddtId);
  if (!candidate) notFound();

  const pledges = await fetchPledges(cnddtId, sgTypecode);
  const electionLabel = getElectionLabel(sgTypecode, candidate.sdName, candidate.sggName);
  const partyStyle = getPartyStyle(candidate.jdName);
  const showPartyBadge = candidate.jdName && candidate.jdName !== '무소속';
  const listUrl = `/candidates/${encodedSido}/${encodedSigungu}`;

  return (
    <div className="flex flex-col min-h-screen bg-canvas">

      {/* ── Nav bar ── */}
      <nav className="sticky top-0 z-20 bg-canvas border-b border-canvas-soft px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <BackButton />
          <h1 className="text-[20px] font-bold leading-[28px] text-ink truncate">
            {candidate.name}
          </h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" aria-label="홈으로" className="flex-shrink-0 ml-3">
          <img src="/icon_home.svg" alt="홈으로" width="28" height="28" />
        </Link>
      </nav>

      {/* ── Profile section ── */}
      <section className="px-4 md:px-8 pt-6 pb-4 max-w-[1200px] mx-auto w-full">
        {/* Top row: 4 identity fields + photo */}
        <div className="flex flex-row">
          {/* Left: 기호 / name / election label / party badge */}
          <div className="flex-1 py-2 pr-4 flex flex-col gap-2 min-w-0">
            {sgTypecode !== '11' && (
              <span className="text-[14px] font-medium leading-[20px] text-body">
                기호 {candidate.giho}
              </span>
            )}
            <p className="text-[24px] font-bold leading-[32px] text-ink">{candidate.name}</p>
            <p className="text-[14px] font-normal leading-[20px] text-body">{electionLabel}</p>
            {showPartyBadge && (
              <span
                className="text-[14px] font-medium leading-[16px] px-2 py-0.5 rounded-full w-fit"
                style={partyStyle}
              >
                {candidate.jdName}
              </span>
            )}
          </div>

          {/* Right: photo — collapses entirely if photo fails to load */}
          <ProfilePhotoSection
            huboid={candidate.huboid}
            sdName={candidate.sdName}
            sgTypecode={candidate.sgTypecode}
            name={candidate.name}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />

        {/* Detailed info rows */}
        <div className="flex flex-col gap-1.5 pb-2">
          <p className="text-[14px] font-normal leading-[20px] text-body">
            {formatBirthdayDot(candidate.birthday)} · {candidate.age}세 · {candidate.gender}
          </p>
          {candidate.job && (
            <p className="text-[14px] leading-[20px]">
              <span className="font-medium" style={{ color: '#000000' }}>직업 </span>
              <span className="font-normal text-body">{candidate.job}</span>
            </p>
          )}
          {candidate.edu && (
            <p className="text-[14px] leading-[20px]">
              <span className="font-medium" style={{ color: '#000000' }}>학력 </span>
              <span className="font-normal text-body">{candidate.edu}</span>
            </p>
          )}
          {candidate.career1 && (
            <p className="text-[14px] leading-[20px]">
              <span className="font-medium" style={{ color: '#000000' }}>경력 </span>
              <span className="font-normal text-body">{candidate.career1}</span>
            </p>
          )}
          {candidate.career2 && (
            <p className="text-[14px] leading-[20px]">
              <span className="font-medium" style={{ color: '#000000' }}>경력 </span>
              <span className="font-normal text-body">{candidate.career2}</span>
            </p>
          )}
        </div>

        {/* 주요 공약 category chips */}
        {pledges.length > 0 && (() => {
          const counts = pledges.reduce<Record<string, number>>((acc, p) => {
            const cat = getPledgeCategory(p);
            acc[cat] = (acc[cat] ?? 0) + 1;
            return acc;
          }, {});
          return (
            <div style={{ marginTop: '12px', marginBottom: '4px' }}>
              <p className="text-[12px] font-medium" style={{ color: '#555555' }}>주요 공약</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(counts).map(([cat, cnt]) => (
                  <CategoryChip key={cat} category={cat} count={cnt} />
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── Section heading ── */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <h2 className="text-[20px] font-bold leading-[28px] text-ink">5대 공약</h2>
      </div>

      {/* ── Pledge cards ── */}
      <section className="flex-1 px-4 md:px-8 pt-2 pb-28 max-w-[1200px] mx-auto w-full">
        <PledgeSection
          pledges={pledges}
          name={candidate.name}
          giho={candidate.giho}
          sgTypecode={sgTypecode}
          sdName={candidate.sdName}
          sggName={candidate.sggName}
        />
      </section>

      {/* ── Bottom CTA ── */}
      <div className="sticky bottom-0 bg-canvas border-t border-canvas-soft px-4 md:px-8 py-4">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href={`${listUrl}?compare=${cnddtId}&sgTypecode=${sgTypecode}`}
            className="block w-full text-center bg-primary text-on-dark text-[16px] font-medium leading-[20px] py-4 rounded-full"
          >
            다른 후보와 비교하기
          </Link>
        </div>
      </div>

    </div>
  );
}

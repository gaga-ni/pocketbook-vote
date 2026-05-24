import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  findCandidateWithType,
  fetchPledges,
  getElectionLabel,
  formatBirthdayDot,
} from '@/app/lib/nec-api';
import { getPartyStyle } from '@/app/lib/partyColors';
import CandidatePhoto from '@/app/components/CandidatePhoto';
import PledgeSection from './PledgeSection';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string; cnddtId: string }>;
}) {
  const { sido: encodedSido, sigungu: encodedSigungu, cnddtId } = await params;
  const sido = decodeURIComponent(encodedSido);
  const sigungu = decodeURIComponent(encodedSigungu);

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
      <nav className="sticky top-0 z-20 bg-canvas border-b border-canvas-soft px-4 md:px-8 py-4 flex items-center gap-3">
        <Link
          href={listUrl}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas-soft text-ink text-[18px] flex-shrink-0"
          aria-label="목록으로"
        >
          ←
        </Link>
        <h1 className="text-[20px] font-bold leading-[28px] text-ink truncate">
          {candidate.name}
        </h1>
      </nav>

      {/* ── Profile section ── */}
      <section className="px-4 md:px-8 pt-6 pb-4 max-w-[1200px] mx-auto w-full">
        {/* Top row: 4 identity fields + photo */}
        <div className="flex flex-row">
          {/* Left: 기호 / name / election label / party badge */}
          <div className="flex-1 py-2 pr-4 flex flex-col gap-2 min-w-0">
            <span className="text-[14px] font-medium leading-[20px] text-body">
              기호 {candidate.giho}
            </span>
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

          {/* Right: photo — fixed 128px width, does not grow */}
          <div className="w-32 flex-shrink-0 py-2">
            <div className="rounded-xl overflow-hidden h-full">
              <CandidatePhoto
                huboid={candidate.huboid}
                sdName={candidate.sdName}
                sgTypecode={candidate.sgTypecode}
                name={candidate.name}
                className="w-full h-full object-top"
              />
            </div>
          </div>
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
      </section>

      {/* ── Section heading ── */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <h2 className="text-[20px] font-bold leading-[28px] text-ink">5대 공약</h2>
      </div>

      {/* ── Pledge accordion ── */}
      <section className="flex-1 px-4 md:px-8 pt-2 pb-28 max-w-[1200px] mx-auto w-full">
        <PledgeSection pledges={pledges} />
      </section>

      {/* ── Bottom CTA ── */}
      <div className="sticky bottom-0 bg-canvas border-t border-canvas-soft px-4 md:px-8 py-4">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href={`${listUrl}?compare=${cnddtId}&sgTypecode=${sgTypecode}`}
            className="block w-full text-center bg-primary text-on-dark text-[16px] font-medium leading-[20px] py-4 rounded-full"
          >
            이 후보와 비교하기
          </Link>
        </div>
      </div>

    </div>
  );
}

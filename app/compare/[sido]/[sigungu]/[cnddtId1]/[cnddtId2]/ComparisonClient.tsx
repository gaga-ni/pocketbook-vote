'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PledgeItem, Candidate } from '@/app/lib/nec-api';
import { getElectionLabel, formatBirthdayDot } from '@/app/lib/nec-api';
import { getPartyStyle } from '@/app/lib/partyColors';
import { getPledgeCategory } from '@/app/lib/categoryMap';
import CandidatePhoto from '@/app/components/CandidatePhoto';
import CategoryChip from '@/app/components/CategoryChip';
import PledgePopup from '@/app/components/PledgePopup';

interface Props {
  pledges1: PledgeItem[];
  pledges2: PledgeItem[];
  cand1: Candidate;
  cand2: Candidate;
  sgTypecode1: string;
  sgTypecode2: string;
  encodedSido: string;
  encodedSigungu: string;
  cnddtId1: string;
  cnddtId2: string;
}

const cardShadow = '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)';

export default function ComparisonClient({
  pledges1,
  pledges2,
  cand1,
  cand2,
  sgTypecode1,
  sgTypecode2,
  encodedSido,
  encodedSigungu,
  cnddtId1,
  cnddtId2,
}: Props) {
  const [removed, setRemoved] = useState<null | '1' | '2'>(null);
  const [popup1Index, setPopup1Index] = useState<number | null>(null);
  const [popup2Index, setPopup2Index] = useState<number | null>(null);

  function removeCand(which: '1' | '2') {
    setRemoved(which);
    if (which === '1') setPopup1Index(null);
    if (which === '2') setPopup2Index(null);
  }

  function openPopup1(index: number) {
    setPopup2Index(null);
    setPopup1Index(index);
  }

  function openPopup2(index: number) {
    setPopup1Index(null);
    setPopup2Index(index);
  }

  const listUrl = `/candidates/${encodedSido}/${encodedSigungu}`;
  const activePledges1 = removed === '1' ? [] : pledges1;
  const activePledges2 = removed === '2' ? [] : pledges2;
  const count = Math.max(activePledges1.length, activePledges2.length, 1);
  const left = Array.from({ length: count }, (_, i) => activePledges1[i] ?? null);
  const right = Array.from({ length: count }, (_, i) => activePledges2[i] ?? null);

  return (
    <>
      {/* ── Two-column candidate header ── */}
      <section className="bg-canvas border-b border-canvas-soft w-full">
        <div className="grid grid-cols-2 divide-x divide-canvas-soft max-w-[1200px] mx-auto">
          {removed === '1' ? (
            <PlaceholderHeader href={`${listUrl}?compare=${cnddtId2}&sgTypecode=${sgTypecode2}`} />
          ) : (
            <CandidateHeaderCol
              candidate={cand1}
              sgTypecode={sgTypecode1}
              encodedSido={encodedSido}
              encodedSigungu={encodedSigungu}
              onRemove={() => removeCand('1')}
              pledges={activePledges1}
            />
          )}
          {removed === '2' ? (
            <PlaceholderHeader href={`${listUrl}?compare=${cnddtId1}&sgTypecode=${sgTypecode1}`} />
          ) : (
            <CandidateHeaderCol
              candidate={cand2}
              sgTypecode={sgTypecode2}
              encodedSido={encodedSido}
              encodedSigungu={encodedSigungu}
              onRemove={() => removeCand('2')}
              pledges={activePledges2}
            />
          )}
        </div>
      </section>

      {/* ── Section heading ── */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <h2 className="text-[20px] font-bold leading-[28px] text-ink">5대 공약 비교</h2>
      </div>

      {/* ── Pledge comparison rows — equal-height paired cards ── */}
      <section className="flex-1 pb-12 max-w-[1200px] mx-auto w-full px-3 md:px-5">
        <div className="flex flex-col gap-2">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="grid grid-cols-2 items-stretch gap-2">
              <PledgeCard
                pledge={left[i]}
                n={i + 1}
                onOpen={left[i] !== null ? () => openPopup1(i) : undefined}
              />
              <PledgeCard
                pledge={right[i]}
                n={i + 1}
                onOpen={right[i] !== null ? () => openPopup2(i) : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Popups ── */}
      <PledgePopup
        isOpen={popup1Index !== null}
        onClose={() => setPopup1Index(null)}
        pledges={activePledges1}
        currentIndex={popup1Index ?? 0}
        onIndexChange={setPopup1Index}
        candidateInfo={{
          name: cand1.name,
          giho: cand1.giho,
          sgTypecode: sgTypecode1,
          sdName: cand1.sdName,
          sggName: cand1.sggName,
        }}
      />
      <PledgePopup
        isOpen={popup2Index !== null}
        onClose={() => setPopup2Index(null)}
        pledges={activePledges2}
        currentIndex={popup2Index ?? 0}
        onIndexChange={setPopup2Index}
        candidateInfo={{
          name: cand2.name,
          giho: cand2.giho,
          sgTypecode: sgTypecode2,
          sdName: cand2.sdName,
          sggName: cand2.sggName,
        }}
      />
    </>
  );
}

// ── Pledge Card ──────────────────────────────────────────────────

interface PledgeCardProps {
  pledge: PledgeItem | null;
  n: number;
  onOpen?: () => void;
}

function PledgeCard({ pledge, n, onOpen }: PledgeCardProps) {
  if (!pledge) {
    return (
      <div
        className="h-full"
        style={{ background: '#f3f3f3', borderRadius: '16px', minHeight: '120px' }}
      />
    );
  }

  const category = getPledgeCategory(pledge);

  return (
    <div
      className="flex flex-col h-full"
      style={{ boxShadow: cardShadow, background: '#ffffff', borderRadius: '16px', padding: '20px' }}
    >
      {/* Row 1: meta */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-medium leading-[20px] text-body">공약 {n}</span>
        <CategoryChip category={category} />
      </div>

      {/* Row 2: title — flex-1 so button is always at bottom */}
      <p
        className="flex-1 text-[20px] font-bold text-ink"
        style={{ marginTop: '8px', lineHeight: '28px' }}
      >
        {pledge.title}
      </p>

      {/* Row 3: more button — always at bottom */}
      <div className="flex justify-end mt-auto" style={{ paddingTop: '14px' }}>
        {onOpen && (
          <button onClick={onOpen} aria-label="더보기">
            <img src="/button_more.svg" alt="더보기" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Candidate Header Column ──────────────────────────────────────

interface HeaderColProps {
  candidate: Candidate;
  sgTypecode: string;
  encodedSido: string;
  encodedSigungu: string;
  onRemove: () => void;
  pledges: PledgeItem[];
}

function CandidateHeaderCol({
  candidate,
  sgTypecode,
  encodedSido,
  encodedSigungu,
  onRemove,
  pledges,
}: HeaderColProps) {
  const partyStyle = getPartyStyle(candidate.jdName);
  const showPartyBadge = candidate.jdName && candidate.jdName !== '무소속';
  const showGiho = sgTypecode !== '11';
  const electionLabel = getElectionLabel(sgTypecode, candidate.sdName, candidate.sggName);
  const detailUrl = `/candidates/${encodedSido}/${encodedSigungu}/${candidate.huboid}`;

  return (
    <div className="relative px-4 md:px-6 py-4 flex flex-col gap-2">
      {/* X remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#efefef' }}
        aria-label="후보 제거"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5l7 7M8.5 1.5l-7 7"
            stroke="#5e5e5e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Link wraps name row + photo */}
      <Link href={detailUrl} className="flex flex-col gap-2 hover:opacity-90 transition-opacity">
        {/* name row */}
        <div className="flex items-baseline gap-1.5 flex-wrap pr-8">
          {showGiho && (
            <span className="text-[14px] font-medium leading-[20px] text-body whitespace-nowrap">
              기호 {candidate.giho}
            </span>
          )}
          <p className="text-[16px] font-medium leading-[20px] text-ink">{candidate.name}</p>
          {showPartyBadge && (
            <span
              className="text-[11px] font-medium leading-[16px] px-2 py-0.5 rounded-full whitespace-nowrap"
              style={partyStyle}
            >
              {candidate.jdName}
            </span>
          )}
        </div>

        {/* Photo */}
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden">
          <CandidatePhoto
            huboid={candidate.huboid}
            sdName={candidate.sdName}
            sgTypecode={candidate.sgTypecode}
            sggName={candidate.sggName}
            name={candidate.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </Link>

      {/* Election type label */}
      <p className="text-[14px] font-normal leading-[20px] text-body">{electionLabel}</p>

      {/* Birthday · age · gender */}
      <p className="text-[14px] font-normal leading-[20px] text-body">
        {formatBirthdayDot(candidate.birthday)} · {candidate.age}세 · {candidate.gender}
      </p>

      {/* 주요 공약 */}
      {pledges.length > 0 && (() => {
        const counts = pledges.reduce<Record<string, number>>((acc, p) => {
          const cat = getPledgeCategory(p);
          acc[cat] = (acc[cat] ?? 0) + 1;
          return acc;
        }, {});
        return (
          <div style={{ marginTop: '8px' }}>
            <p className="text-[12px] font-medium" style={{ color: '#555555' }}>주요 공약</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(counts).map(([cat, cnt]) => (
                <CategoryChip key={cat} category={cat} count={cnt} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Placeholder Header (candidate removed) ───────────────────────

function PlaceholderHeader({ href }: { href: string }) {
  return (
    <div className="px-4 md:px-6 py-4 min-h-[160px] flex">
      <Link
        href={href}
        className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl"
        style={{ background: '#f3f3f3', border: '1px dashed #afafaf' }}
      >
        <span className="text-[24px] leading-none" style={{ color: '#5e5e5e' }}>+</span>
        <p className="text-[14px] font-normal" style={{ color: '#5e5e5e' }}>비교할 후보자 선택</p>
      </Link>
    </div>
  );
}

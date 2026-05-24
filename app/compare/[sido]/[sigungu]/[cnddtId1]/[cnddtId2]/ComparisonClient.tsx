'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PledgeItem, PledgeSection, Candidate } from '@/app/lib/nec-api';
import { getElectionLabel, formatBirthdayDot } from '@/app/lib/nec-api';
import { getPartyStyle } from '@/app/lib/partyColors';
import CandidatePhoto from '@/app/components/CandidatePhoto';

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
              onRemove={() => setRemoved('1')}
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
              onRemove={() => setRemoved('2')}
            />
          )}
        </div>
      </section>

      {/* ── Section heading ── */}
      <div className="px-4 md:px-8 mt-8 mb-4 max-w-[1200px] mx-auto w-full">
        <h2 className="text-[20px] font-bold leading-[28px] text-ink">5대 공약 비교</h2>
      </div>

      {/* ── Pledge comparison rows — two independent columns ── */}
      <section className="flex-1 pb-12 max-w-[1200px] mx-auto w-full px-3 md:px-5">
        <div className="grid grid-cols-2 items-start gap-2">
          <div className="flex flex-col gap-2">
            {left.map((pledge, i) => (
              <PledgeAccordion key={i} pledge={pledge} n={i + 1} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {right.map((pledge, i) => (
              <PledgeAccordion key={i} pledge={pledge} n={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Candidate Header Column ──────────────────────────────────────

interface HeaderColProps {
  candidate: Candidate;
  sgTypecode: string;
  encodedSido: string;
  encodedSigungu: string;
  onRemove: () => void;
}

function CandidateHeaderCol({
  candidate,
  sgTypecode,
  encodedSido,
  encodedSigungu,
  onRemove,
}: HeaderColProps) {
  const partyStyle = getPartyStyle(candidate.jdName);
  const showPartyBadge = candidate.jdName && candidate.jdName !== '무소속';
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
        {/* 기호 N + name + party badge */}
        <div className="flex items-baseline gap-1.5 flex-wrap pr-8">
          <span className="text-[14px] font-medium leading-[20px] text-body whitespace-nowrap">
            기호 {candidate.giho}
          </span>
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
        <div className="aspect-[3/2] rounded-xl overflow-hidden w-full">
          <CandidatePhoto
            imgUrl={candidate.imgUrl}
            name={candidate.name}
            className="w-full h-full"
          />
        </div>
      </Link>

      {/* Election type label */}
      <p className="text-[14px] font-normal leading-[20px] text-body">{electionLabel}</p>

      {/* Birthday · age · gender */}
      <p className="text-[14px] font-normal leading-[20px] text-body">
        {formatBirthdayDot(candidate.birthday)} · {candidate.age}세 · {candidate.gender}
      </p>
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

// ── Single independent accordion ────────────────────────────────

interface AccordionProps {
  pledge: PledgeItem | null;
  n: number;
}

const cardShadow = '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)';

function PledgeAccordion({ pledge, n }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!pledge) {
    return (
      <div
        style={{
          background: '#f3f3f3',
          borderRadius: '12px',
          minHeight: '64px',
        }}
      />
    );
  }

  return (
    <div style={{ boxShadow: cardShadow, background: '#ffffff', borderRadius: '12px' }}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-2 text-left"
        style={{ padding: '12px 16px' }}
      >
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[14px] font-medium leading-[20px] text-body">
            공약 {n}.
          </span>
          <span className="text-[17px] font-medium leading-[26px] text-ink">
            {pledge.title}
          </span>
        </div>
        <Chevron open={isOpen} />
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="mx-4 border-t border-gray-200 mt-3 mb-3" />
          <div className="space-y-4" style={{ padding: '0 16px 12px' }}>
            {pledge.sections.map((section, i) => (
              <SectionBlock key={i} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: PledgeSection }) {
  return (
    <div>
      <p
        className="mb-1"
        style={{ fontSize: '13px', fontWeight: 600, color: '#282828', lineHeight: '20px' }}
      >
        {section.label}
      </p>
      <p className="text-[14px] font-normal leading-[22px] text-body whitespace-pre-wrap">
        {section.body}
      </p>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`flex-shrink-0 text-body transition-transform duration-200 mt-1 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

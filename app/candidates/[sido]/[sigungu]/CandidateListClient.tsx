'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Candidate } from '@/app/lib/nec-api';
import { formatBirthdayDot, getElectionLabel } from '@/app/lib/nec-api';
import { getPartyStyle } from '@/app/lib/partyColors';
import CandidatePhoto from '@/app/components/CandidatePhoto';

type TabType = '3' | '4' | '11';

const TAB_LABELS: Record<TabType, string> = {
  '3': '시·도지사',
  '4': '구·시·군의 장',
  '11': '교육감',
};

interface Props {
  sido: string;
  sigungu: string;
  type3: Candidate[];
  type4: Candidate[];
  type11: Candidate[];
  initialCompare?: { cnddtId: string; sgTypecode: TabType };
}

export default function CandidateListClient({
  sido,
  sigungu,
  type3,
  type4,
  type11,
  initialCompare,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab: TabType =
    rawTab === '3' || rawTab === '4' || rawTab === '11'
      ? rawTab
      : (initialCompare?.sgTypecode ?? '3');
  const [selected, setSelected] = useState<string[]>(
    initialCompare ? [initialCompare.cnddtId] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const allByTab: Record<TabType, Candidate[]> = {
    '3': type3,
    '4': type4,
    '11': type11,
  };
  const activeCandidates = allByTab[activeTab];
  const selectedCandidates = activeCandidates.filter((c) => selected.includes(c.huboid));

  function switchTab(tab: TabType) {
    setIsTabLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
    setSelected([]);
    setTimeout(() => setIsTabLoading(false), 300);
  }

  function toggleCompare(huboid: string) {
    setSelected((prev) => {
      if (prev.includes(huboid)) return prev.filter((id) => id !== huboid);
      if (prev.length >= 2) return prev;
      return [...prev, huboid];
    });
  }

  return (
    <>
      {/* ── Tab bar ── */}
      <div className="px-4 md:px-8 pt-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max">
          {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium leading-[20px] transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-on-dark'
                  : 'bg-canvas-soft text-ink'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Candidate grid ── */}
      <main className="flex-1 px-4 md:px-8 py-4 pb-36 w-full max-w-[1200px] mx-auto">
        {isTabLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden flex"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <div className="flex-[3] p-5 flex flex-col gap-3">
                  <div className="skeleton-shimmer h-4 w-24 rounded-full" />
                  <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
                  <div className="skeleton-shimmer h-4 w-40 rounded-lg" />
                  <div className="skeleton-shimmer h-4 w-28 rounded-lg" />
                  <div className="skeleton-shimmer h-9 w-24 rounded-full mt-2" />
                </div>
                <div className="w-36 flex-shrink-0 skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : activeCandidates.length === 0 ? (
          <p className="py-16 text-center text-[16px] font-normal leading-[24px] text-body">
            등록된 후보자가 없어요.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.huboid}
                candidate={candidate}
                sido={sido}
                sigungu={sigungu}
                isSelected={selected.includes(candidate.huboid)}
                onToggleCompare={() => toggleCompare(candidate.huboid)}
                compareDisabled={
                  selected.length >= 2 && !selected.includes(candidate.huboid)
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Floating compare bar ── */}
      {selected.length > 0 && (
        <div
          className="fixed bottom-4 inset-x-4 z-20 bg-canvas rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 16px 0px' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-normal leading-[20px] text-body">
              {selected.length}명 선택됨
            </p>
            <p className="text-[14px] font-medium leading-[20px] text-ink truncate">
              {selectedCandidates.map((c) => c.name).join(' vs ')}
            </p>
          </div>
          {selected.length === 2 && (
            <button
              onClick={() => {
                setIsLoading(true);
                router.push(
                  `/compare/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}/${selected[0]}/${selected[1]}`
                );
              }}
              disabled={isLoading}
              className="flex-shrink-0 bg-primary text-on-dark text-[16px] font-medium leading-[20px] px-5 py-3 rounded-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  공약 비교 중...
                </span>
              ) : '공약 비교하기'}
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ── Candidate Card ───────────────────────────────────────────────

interface CardProps {
  candidate: Candidate;
  sido: string;
  sigungu: string;
  isSelected: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}

function CandidateCard({
  candidate,
  sido,
  sigungu,
  isSelected,
  onToggleCompare,
  compareDisabled,
}: CardProps) {
  const detailUrl = `/candidates/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}/${candidate.huboid}`;
  const showPartyBadge = candidate.jdName && candidate.jdName !== '무소속';
  const partyStyle = getPartyStyle(candidate.jdName);
  const electionLabel = getElectionLabel(candidate.sgTypecode, candidate.sdName, candidate.sggName);

  return (
    <div
      className={`relative isolate bg-canvas rounded-2xl flex flex-row overflow-hidden border-2 transition-all ${
        isSelected
          ? 'border-primary'
          : 'border-transparent shadow-sm hover:shadow-md'
      }`}
    >
      {/* Full-card navigation link */}
      <Link
        href={detailUrl}
        className="absolute inset-0 z-[1] rounded-2xl"
        aria-label={`${candidate.name} 상세 보기`}
      />

      {/* Left section — flex-[3] */}
      <div className="flex-[3] p-5 flex flex-col gap-2 min-w-0">
        {/* Row 1: 기호 N + name + party badge */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {candidate.sgTypecode !== '11' && (
            <span className="text-[14px] font-normal leading-[20px] text-body whitespace-nowrap">
              기호 {candidate.giho}
            </span>
          )}
          <p className="text-[20px] font-bold leading-[28px] text-ink">{candidate.name}</p>
          {showPartyBadge && (
            <span
              className="text-[14px] font-medium leading-[16px] px-2 py-0.5 rounded-full whitespace-nowrap"
              style={partyStyle}
            >
              {candidate.jdName}
            </span>
          )}
        </div>

        {/* Row 2: birthday · age · gender */}
        <p className="text-[14px] font-normal leading-[20px] text-body">
          {formatBirthdayDot(candidate.birthday)} · {candidate.age}세 · {candidate.gender}
        </p>

        {/* Row 3: election type label */}
        <p className="text-[14px] font-normal leading-[20px] text-body">{electionLabel}</p>

        <div className="flex-1" />

        {/* Compare button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          disabled={compareDisabled}
          className={`relative z-[2] mt-2 self-start px-4 py-3 rounded-full text-[14px] font-medium leading-[20px] transition-colors ${
            isSelected
              ? 'bg-primary text-on-dark'
              : compareDisabled
              ? 'bg-canvas-soft text-mute cursor-not-allowed'
              : 'bg-canvas-soft text-ink'
          }`}
        >
          {isSelected ? '선택됨' : '비교하기'}
        </button>
      </div>

      {/* Right section — photo stretches to full card height */}
      <div className="w-36 flex-shrink-0 self-stretch overflow-hidden rounded-r-2xl">
        <CandidatePhoto
          huboid={candidate.huboid}
          sdName={candidate.sdName}
          sgTypecode={candidate.sgTypecode}
          name={candidate.name}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

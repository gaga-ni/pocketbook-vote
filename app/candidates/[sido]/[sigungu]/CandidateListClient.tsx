'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Candidate } from '@/app/lib/nec-api';
import { formatBirthdayDot } from '@/app/lib/nec-api';
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
  const [activeTab, setActiveTab] = useState<TabType>(
    initialCompare?.sgTypecode ?? '3'
  );
  const [selected, setSelected] = useState<string[]>(
    initialCompare ? [initialCompare.cnddtId] : []
  );

  const allByTab: Record<TabType, Candidate[]> = {
    '3': type3,
    '4': type4,
    '11': type11,
  };
  const activeCandidates = allByTab[activeTab];
  const selectedCandidates = activeCandidates.filter((c) => selected.includes(c.huboid));

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setSelected([]);
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
        {activeCandidates.length === 0 ? (
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
                showDistrict={activeTab === '4'}
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
              onClick={() =>
                router.push(
                  `/compare/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}/${selected[0]}/${selected[1]}`
                )
              }
              className="flex-shrink-0 bg-primary text-on-dark text-[16px] font-medium leading-[20px] px-5 py-3 rounded-full"
            >
              공약 비교하기
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
  showDistrict: boolean;
  isSelected: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}

function CandidateCard({
  candidate,
  sido,
  sigungu,
  showDistrict,
  isSelected,
  onToggleCompare,
  compareDisabled,
}: CardProps) {
  const detailUrl = `/candidates/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}/${candidate.huboid}`;
  const showPartyBadge = candidate.jdName && candidate.jdName !== '무소속';
  const partyStyle = getPartyStyle(candidate.jdName);

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
          <span className="text-[14px] font-normal leading-[20px] text-body whitespace-nowrap">
            기호 {candidate.giho}
          </span>
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

        {/* Row 3: district (구시군의장 only) */}
        {showDistrict && candidate.sggName && (
          <p className="text-[14px] font-normal leading-[20px] text-body">{candidate.sggName}</p>
        )}

        <div className="flex-1" />

        {/* Compare button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          disabled={compareDisabled}
          className={`relative z-[2] mt-1 w-full py-2 rounded-full text-[14px] font-medium leading-[20px] transition-colors ${
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

      {/* Right section — flex-[2], photo */}
      <div className="flex-[2] self-stretch min-h-[160px]">
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

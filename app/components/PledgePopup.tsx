'use client';

import { useState, useEffect } from 'react';
import type { PledgeItem } from '@/app/lib/nec-api';
import { getElectionLabel } from '@/app/lib/nec-api';
import { getPledgeCategory } from '@/app/lib/categoryMap';
import CategoryChip from '@/app/components/CategoryChip';

interface CandidateInfo {
  name: string;
  giho: string;
  sgTypecode: string;
  sdName: string;
  sggName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pledges: PledgeItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  candidateInfo: CandidateInfo;
}

export default function PledgePopup({
  isOpen,
  onClose,
  pledges,
  currentIndex,
  onIndexChange,
  candidateInfo,
}: Props) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimated(true)));
    } else {
      setIsAnimated(false);
    }
  }, [isOpen]);

  if (!isOpen || !pledges[currentIndex]) return null;

  const pledge = pledges[currentIndex];
  const { name, giho, sgTypecode, sdName, sggName } = candidateInfo;
  const electionLabel = getElectionLabel(sgTypecode, sdName, sggName);
  const showGiho = sgTypecode !== '11';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl flex flex-col"
        style={{
          maxHeight: '85vh',
          transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 250ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Row 1: title bar */}
        <div className="flex items-center gap-[14px] px-5 pt-5 pb-0">
          <p className="flex-1 text-center text-[16px] font-medium" style={{ color: '#000000' }}>
            {showGiho && `기호 ${giho}  `}
            {name}&nbsp;&nbsp;({electionLabel})
          </p>
          <button onClick={onClose} aria-label="닫기" className="flex-shrink-0">
            <img src="/button_close.svg" alt="닫기" />
          </button>
        </div>

        {/* Row 2: pledge meta */}
        <div className="flex items-center gap-2 px-5 pt-4">
          <span className="text-[14px] font-medium leading-[20px] text-body">
            공약 {pledge.number}
          </span>
          <CategoryChip category={getPledgeCategory(pledge)} />
        </div>

        {/* Row 3: pledge title */}
        <div className="px-5 pt-2 pb-4" style={{ borderBottom: '1px solid #efefef' }}>
          <p className="text-[20px] font-bold" style={{ color: '#000000', lineHeight: '28px' }}>
            {pledge.title}
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {pledge.sections.map((section, i) => (
            <div key={i} className="mb-4">
              <p
                className="mb-1"
                style={{ fontSize: '14px', fontWeight: 600, color: '#282828', lineHeight: '20px' }}
              >
                {section.label}
              </p>
              <p
                className="whitespace-pre-line"
                style={{ fontSize: '14px', fontWeight: 400, color: '#5e5e5e', lineHeight: '1.6' }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Fixed footer */}
        <div
          className="flex justify-between items-center px-5 py-4"
          style={{ borderTop: '1px solid #efefef' }}
        >
          <button
            onClick={() => onIndexChange(Math.max(currentIndex - 1, 0))}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-full text-[16px] font-medium"
            style={{
              background: '#efefef',
              color: '#000000',
              opacity: currentIndex === 0 ? 0.4 : 1,
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            이전 공약
          </button>
          <button
            onClick={() => onIndexChange(Math.min(currentIndex + 1, pledges.length - 1))}
            disabled={currentIndex === pledges.length - 1}
            className="px-5 py-2.5 rounded-full text-[16px] font-medium"
            style={{
              background: '#000000',
              color: '#ffffff',
              opacity: currentIndex === pledges.length - 1 ? 0.4 : 1,
              cursor: currentIndex === pledges.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            다음 공약
          </button>
        </div>
      </div>
    </div>
  );
}

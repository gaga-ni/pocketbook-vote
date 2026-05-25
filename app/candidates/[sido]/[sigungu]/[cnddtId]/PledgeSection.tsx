'use client';

import { useState } from 'react';
import type { PledgeItem } from '@/app/lib/nec-api';
import { getPledgeCategory } from '@/app/lib/categoryMap';
import PledgePopup from '@/app/components/PledgePopup';
import CategoryChip from '@/app/components/CategoryChip';

const cardShadow = '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)';

interface Props {
  pledges: PledgeItem[];
  name: string;
  giho: string;
  sgTypecode: string;
  sdName: string;
  sggName: string;
}

export default function PledgeSection({ pledges, name, giho, sgTypecode, sdName, sggName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (pledges.length === 0) {
    return (
      <p className="py-8 text-center text-[16px] font-normal text-body">
        공약 정보를 불러올 수 없습니다
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pledges.map((pledge, i) => {
          const category = getPledgeCategory(pledge);
          return (
            <div
              key={pledge.number}
              style={{
                boxShadow: cardShadow,
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium leading-[20px] text-body">
                  공약 {pledge.number}
                </span>
                <CategoryChip category={category} />
              </div>
              <p
                className="text-[20px] font-bold text-ink"
                style={{ marginTop: '8px', lineHeight: '28px' }}
              >
                {pledge.title}
              </p>
              <div className="flex justify-end" style={{ marginTop: '14px' }}>
                <button onClick={() => setSelectedIndex(i)} aria-label="더보기">
                  <img src="/button_more.svg" alt="더보기" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <PledgePopup
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        pledges={pledges}
        currentIndex={selectedIndex ?? 0}
        onIndexChange={setSelectedIndex}
        candidateInfo={{ name, giho, sgTypecode, sdName, sggName }}
      />
    </>
  );
}

'use client';

import { useState } from 'react';
import type { PledgeItem } from '@/app/lib/nec-api';

const cardShadow = '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)';

export default function PledgeSection({ pledges }: { pledges: PledgeItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (pledges.length === 0) {
    return (
      <p className="py-8 text-center text-[16px] font-normal text-body">
        공약 정보를 불러올 수 없습니다
      </p>
    );
  }

  return (
    <div>
      {pledges.map((pledge, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              boxShadow: cardShadow,
              background: '#ffffff',
              borderRadius: '12px',
              marginBottom: '8px',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center gap-3 text-left"
              style={{ padding: '14px 16px' }}
            >
              <span className="text-[14px] font-medium leading-[20px] text-body flex-shrink-0">
                공약 {pledge.number}
              </span>
              <span className="flex-1 text-[16px] font-semibold leading-[20px] text-ink">
                {pledge.title}
              </span>
              <Chevron open={isOpen} />
            </button>

            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="mx-4 border-t border-gray-200 mt-3 mb-3" />
                <div className="space-y-4" style={{ padding: '0 16px 12px' }}>
                  {pledge.sections.map((section, j) => (
                    <div key={j}>
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`flex-shrink-0 text-body transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

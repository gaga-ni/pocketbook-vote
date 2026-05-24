'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SIDO_LIST = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
  '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도',
  '경상남도', '제주특별자치도',
];

export default function RegionSelect() {
  const router = useRouter();
  const [selectedSido, setSelectedSido] = useState<string | null>(null);
  const [sigunguList, setSigunguList] = useState<string[]>([]);
  const [selectedSigungu, setSelectedSigungu] = useState<string | null>(null);
  const [loadingSigungu, setLoadingSigungu] = useState(false);

  async function handleSidoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sido = e.target.value;
    if (!sido) {
      setSelectedSido(null);
      setSigunguList([]);
      setSelectedSigungu(null);
      return;
    }

    setSelectedSido(sido);
    setSelectedSigungu(null);
    setSigunguList([]);
    setLoadingSigungu(true);

    try {
      const res = await fetch(`/api/sigungu?sido=${encodeURIComponent(sido)}`);
      const data: { sigunguList: string[] } = await res.json();
      const list = data.sigunguList ?? [];

      if (list.length === 0) {
        // 세종특별자치시 등 구시군이 없는 지역 → 바로 이동
        router.push(`/candidates/${encodeURIComponent(sido)}/${encodeURIComponent(sido)}`);
        return;
      }

      setSigunguList(list);
    } catch {
      setSigunguList([]);
    } finally {
      setLoadingSigungu(false);
    }
  }

  function handleConfirm() {
    if (!selectedSido || !selectedSigungu) return;
    router.push(
      `/candidates/${encodeURIComponent(selectedSido)}/${encodeURIComponent(selectedSigungu)}`
    );
  }

  const showSigungu = selectedSido !== null;
  const canConfirm = selectedSido !== null && selectedSigungu !== null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[16px] font-medium leading-[20px] text-ink">내 지역 선택하기</p>

      {/* Step 1: 시도 */}
      <div className="relative">
        <select
          defaultValue=""
          onChange={handleSidoChange}
          className="w-full bg-canvas-soft text-ink text-[16px] font-normal leading-[24px] px-4 py-4 rounded-lg appearance-none cursor-pointer focus:outline-none"
        >
          <option value="" disabled>시·도 선택</option>
          {SIDO_LIST.map((sido) => (
            <option key={sido} value={sido}>{sido}</option>
          ))}
        </select>
        <Chevron />
      </div>

      {/* Step 2: 구시군 — fade in after sido selected */}
      <div
        className={`transition-all duration-200 overflow-hidden ${
          showSigungu ? 'opacity-100 max-h-[80px]' : 'opacity-0 max-h-0'
        }`}
      >
        <div className="relative">
          <select
            key={selectedSido ?? ''}
            defaultValue=""
            onChange={(e) => setSelectedSigungu(e.target.value || null)}
            disabled={loadingSigungu}
            className="w-full bg-canvas-soft text-ink text-[16px] font-normal leading-[24px] px-4 py-4 rounded-lg appearance-none cursor-pointer focus:outline-none disabled:cursor-default"
          >
            {loadingSigungu ? (
              <option value="" disabled>불러오는 중...</option>
            ) : (
              <>
                <option value="" disabled>구·시·군 선택</option>
                {sigunguList.map((sigungu) => (
                  <option key={sigungu} value={sigungu}>{sigungu}</option>
                ))}
              </>
            )}
          </select>
          <Chevron />
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className={`w-full text-[16px] font-medium leading-[20px] px-4 py-3 rounded-full transition-colors ${
          canConfirm
            ? 'bg-primary text-on-dark'
            : 'bg-canvas-soft text-mute cursor-not-allowed'
        }`}
      >
        후보자 보기
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 6l4 4 4-4"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

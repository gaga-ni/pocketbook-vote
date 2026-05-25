'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-canvas-soft text-ink text-[18px] flex-shrink-0"
      aria-label="뒤로 가기"
    >
      ←
    </button>
  );
}

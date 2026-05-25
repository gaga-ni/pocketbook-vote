'use client';

import { useState, useRef } from 'react';

export default function FloatingButton() {
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function handleClick() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowToast(true);
    timerRef.current = setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <>
      <style>{`
        @keyframes wiggle {
          0%, 70%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(-15deg); }
          82% { transform: rotate(15deg); }
          89% { transform: rotate(-8deg); }
          95% { transform: rotate(8deg); }
        }
        .wiggle-button {
          animation: wiggle 3s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* Toast */}
      <div
        style={{
          position: 'fixed',
          bottom: '104px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111111',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 500,
          padding: '10px 20px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          zIndex: 60,
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease',
          opacity: showToast ? 1 : 0,
        }}
        aria-live="polite"
      >
        준비 중이에요! 조금만 기다려 주세요 😊
      </div>

      {/* Floating button */}
      <button
        onClick={handleClick}
        aria-label="투표 인증서"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
        className="md:bottom-8 md:right-8"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/button_floating.svg" alt="투표 인증서" width="64" height="64" className="wiggle-button" />
      </button>
    </>
  );
}

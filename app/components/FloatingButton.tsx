'use client';

import { useState, useRef, useEffect } from 'react';

export default function FloatingButton() {
  const [showToast, setShowToast] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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
        준비 중이에요! 6.3 선거날에 만나요 🗳️
      </div>

      {/* Floating button */}
      <div
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-opacity duration-300 ${
          isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          onClick={handleClick}
          aria-label="투표 인증서"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/button_floating.svg" alt="투표 인증서" width="64" height="64" className="wiggle-button" />
        </button>
      </div>
    </>
  );
}

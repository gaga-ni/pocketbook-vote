'use client';

import { useState, useCallback } from 'react';

interface RainIcon {
  id: number;
  src: string;
  x: number;
  delay: number;
  size: number;
  rotation: number;
}

const ICONS = Array.from({ length: 11 }, (_, i) =>
  `/icon_note_${String(i + 1).padStart(2, '0')}.png`
);

export default function LogoRain() {
  const [rainIcons, setRainIcons] = useState<RainIcon[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerRain = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const icons: RainIcon[] = ICONS.map((src, i) => ({
      id: Date.now() + i,
      src,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 400,
      size: 36 + Math.floor(Math.random() * 24),
      rotation: -20 + Math.random() * 40,
    }));

    setRainIcons(icons);

    setTimeout(() => {
      setRainIcons([]);
      setIsAnimating(false);
    }, 1800);
  }, [isAnimating]);

  return (
    <>
      <button onClick={triggerRain} className="focus:outline-none" aria-label="6.3 선거 포켓북">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="6.3 선거 포켓북" height="44" className="w-auto" />
      </button>

      {rainIcons.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {rainIcons.map((icon) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={icon.id}
              src={icon.src}
              alt=""
              style={{
                position: 'absolute',
                top: '-60px',
                left: `${icon.x}%`,
                width: `${icon.size}px`,
                height: `${icon.size}px`,
                '--rot': `${icon.rotation}deg`,
                animation: 'rainFall 1.4s ease-in forwards',
                animationDelay: `${icon.delay}ms`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes rainFall {
          0% {
            transform: translateY(0) rotate(var(--rot, 0deg));
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(calc(var(--rot, 0deg) + 180deg));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

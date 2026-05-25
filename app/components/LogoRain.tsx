'use client';

import { useState, useCallback } from 'react';

interface RainIcon {
  id: number;
  src: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  spin: number;
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
      x: 5 + Math.random() * 85,
      delay: Math.random() * 600,
      duration: 1.0 + Math.random() * 1.2,
      rotation: -30 + Math.random() * 60,
      spin: Math.random() > 0.5 ? 1 : -1,
    }));

    setRainIcons(icons);

    setTimeout(() => {
      setRainIcons([]);
      setIsAnimating(false);
    }, 3000);
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
                top: '-80px',
                left: `${icon.x}%`,
                transform: `rotate(${icon.rotation}deg)`,
                animation: `rainFall ${icon.duration}s ease-in forwards`,
                animationDelay: `${icon.delay}ms`,
                '--rot': `${icon.rotation}deg`,
                '--spin': `${icon.spin}`,
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
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(115vh) rotate(calc(var(--rot, 0deg) + calc(var(--spin, 1) * 200deg)));
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

'use client';

import { useRef, useState } from 'react';

// SVG canvas dimensions
const SVG_W = 900;
const SVG_H = 1200;

// Photo rect from certificate.svg: x=169 y=223 w=561.831 h=561.831 rx=14.4059
const PHOTO_X = 169;
const PHOTO_Y = 223;
const PHOTO_W = 561.831;
const PHOTO_H = 561.831;
const PHOTO_RX = 14.4059;

// Date text y-position in SVG coordinates (below certification text ~y=839)
const DATE_Y = 960;

function getCertificateDate(): { date: string; type: string } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month === 5 && day === 29) return { date: '2026.5.29', type: '사전투표' };
  if (month === 5 && day === 30) return { date: '2026.5.30', type: '사전투표' };
  if (month === 6 && day === 3)  return { date: '2026.6.3',  type: '본투표'   };
  return { date: `2026.${month}.${day}`, type: '' };
}

export default function CertificatePage() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const { date, type } = getCertificateDate();
  const dateText = type ? `${date} ${type}` : date;

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = '';
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = SVG_W;
    canvas.height = SVG_H;

    // 1. Draw certificate SVG as base
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, SVG_W, SVG_H); resolve(); };
      img.onerror = reject;
      img.src = '/certificate.svg';
    });

    // 2. Draw user photo clipped to rounded-rect photo area
    if (userPhoto) {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();

          // Rounded-rect clip path matching SVG photo rect
          const px = PHOTO_X, py = PHOTO_Y, pw = PHOTO_W, ph = PHOTO_H, r = PHOTO_RX;
          ctx.beginPath();
          ctx.moveTo(px + r, py);
          ctx.lineTo(px + pw - r, py);
          ctx.quadraticCurveTo(px + pw, py, px + pw, py + r);
          ctx.lineTo(px + pw, py + ph - r);
          ctx.quadraticCurveTo(px + pw, py + ph, px + pw - r, py + ph);
          ctx.lineTo(px + r, py + ph);
          ctx.quadraticCurveTo(px, py + ph, px, py + ph - r);
          ctx.lineTo(px, py + r);
          ctx.quadraticCurveTo(px, py, px + r, py);
          ctx.closePath();
          ctx.clip();

          // Center-crop photo to fill the square area
          const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
          const srcX = (img.naturalWidth  - srcSize) / 2;
          const srcY = (img.naturalHeight - srcSize) / 2;
          ctx.drawImage(img, srcX, srcY, srcSize, srcSize, px, py, pw, ph);

          ctx.restore();
          resolve();
        };
        img.onerror = reject;
        img.src = userPhoto;
      });
    }

    // 3. Overlay date text
    ctx.font      = '500 26px Pretendard, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(dateText, SVG_W / 2, DATE_Y);

    // 4. Download or share
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
    if (!blob) return;

    const file = new File([blob], '투표인증서_2026.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: '투표 인증서' });
        return;
      } catch {
        // fall through to download link
      }
    }

    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = '투표인증서_2026.png';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Photo overlay position as percentages of the 3:4 certificate container
  const photoStyle: React.CSSProperties = {
    position:     'absolute',
    left:         `${(PHOTO_X / SVG_W) * 100}%`,
    top:          `${(PHOTO_Y / SVG_H) * 100}%`,
    width:        `${(PHOTO_W / SVG_W) * 100}%`,
    height:       `${(PHOTO_H / SVG_H) * 100}%`,
    borderRadius: `${(PHOTO_RX / PHOTO_W) * 100}%`,
    overflow:     'hidden',
    cursor:       'pointer',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page title */}
      <div className="px-4 pt-6 pb-3">
        <p className="text-[16px] font-[400] leading-[22px] text-[#5e5e5e]">투표 인증서</p>
      </div>

      {/* Certificate + controls */}
      <div className="flex flex-col items-center px-4">

        {/* Certificate frame — 3:4 aspect ratio, max 375px wide */}
        <div
          className="relative w-full"
          style={{ maxWidth: '375px', aspectRatio: '3 / 4' }}
        >
          {/* Base SVG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificate.svg"
            alt="투표 인증서 배경"
            className="w-full h-full select-none"
            style={{ display: 'block', userSelect: 'none', WebkitUserSelect: 'none' }}
            draggable={false}
          />

          {/* Photo overlay — tap to pick / change photo */}
          <div style={photoStyle} onClick={() => inputRef.current?.click()}>
            {userPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userPhoto}
                alt="내 사진"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            ) : (
              <div
                style={{
                  width:          '100%',
                  height:         '100%',
                  background:     'rgba(0, 0, 0, 0.4)',
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '8px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.5"/>
                </svg>
                <span style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>사진 추가</span>
              </div>
            )}
          </div>

          {/* Date text overlay */}
          <div
            style={{
              position:       'absolute',
              top:            `${(DATE_Y / SVG_H) * 100}%`,
              left:           0,
              right:          0,
              textAlign:      'center',
              pointerEvents:  'none',
            }}
          >
            <span
              style={{
                fontSize:   'clamp(10px, 2.8vw, 13px)',
                fontWeight: 500,
                color:      '#333333',
                lineHeight: 1,
              }}
            >
              {dateText}
            </span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleDownload}
          className="w-full mt-6 rounded-full bg-black text-white text-[16px] font-[500] leading-[22px]"
          style={{ maxWidth: '375px', padding: '12px 16px' }}
        >
          저장하기
        </button>

        {/* Pre-vote caption */}
        <p
          className="mt-4 text-center text-[12px] font-[400] leading-[17px]"
          style={{ color: '#afafaf', maxWidth: '375px' }}
        >
          사전투표: 5.29(목) ~ 5.30(금)
        </p>
      </div>

      {/* Hidden canvas for compositing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoSelect}
      />
    </div>
  );
}

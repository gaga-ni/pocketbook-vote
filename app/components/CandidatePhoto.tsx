'use client';

import { useState } from 'react';
import { getCandidatePhotoUrl } from '@/app/lib/photoUrl';

interface Props {
  huboid: string;
  sdName: string;
  sgTypecode: string;
  name: string;
  className?: string;
  hideOnError?: boolean;
}

export default function CandidatePhoto({
  huboid,
  sdName,
  sgTypecode,
  name,
  className = '',
  hideOnError = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(!!huboid);
  const [hasError, setHasError] = useState(false);

  if (!huboid || hasError) {
    if (hideOnError) return null;
    return (
      <div className={`flex items-center justify-center bg-[#efefef] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img_default.svg"
          alt="기본 이미지"
          className="w-1/2 h-1/2 object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
    );
  }

  const photoUrl = getCandidatePhotoUrl(huboid, sdName, sgTypecode);

  return (
    <div className={`relative ${className}`}>
      {isLoading && <div className="absolute inset-0 skeleton-shimmer" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={name}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setHasError(true); }}
      />
    </div>
  );
}

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
  const [error, setError] = useState(false);

  if (error || !huboid) {
    if (hideOnError) return null;
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ background: '#efefef' }}>
        <img
          src="/img_default.svg"
          alt="기본 이미지"
          className="w-1/2 h-1/2 object-contain opacity-40"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
    );
  }

  const photoUrl = getCandidatePhotoUrl(huboid, sdName, sgTypecode);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl}
      alt={name}
      onError={() => setError(true)}
      className={`object-cover object-top ${className}`}
    />
  );
}

'use client';

import { useState } from 'react';
import { getCandidatePhotoUrl } from '@/app/lib/photoUrl';

interface Props {
  huboid: string;
  sdName: string;
  sgTypecode: string;
  name: string;
  className?: string;
}

export default function CandidatePhoto({
  huboid,
  sdName,
  sgTypecode,
  name,
  className = '',
}: Props) {
  const [error, setError] = useState(false);

  if (error || !huboid) {
    return (
      <div className={`bg-canvas-soft flex items-center justify-center ${className}`}>
        <span className="text-[20px] font-bold leading-[28px] text-body select-none">
          {name.charAt(0)}
        </span>
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

'use client';

import { useState } from 'react';
import { getCandidatePhotoUrl } from '@/app/lib/photoUrl';

interface Props {
  huboid: string;
  sdName: string;
  sgTypecode: string;
  name: string;
}

export default function ProfilePhotoSection({ huboid, sdName, sgTypecode, name }: Props) {
  const [error, setError] = useState(false);

  if (error || !huboid) return null;

  const photoUrl = getCandidatePhotoUrl(huboid, sdName, sgTypecode);

  return (
    <div className="w-32 flex-shrink-0 py-2">
      <div className="rounded-xl overflow-hidden h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
}

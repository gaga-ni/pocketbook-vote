import { NextRequest, NextResponse } from 'next/server';
import { getGsgCode } from '@/app/lib/sggCodeMap';

const IMAGE_HEADERS = {
  'Content-Type': 'image/jpeg',
  'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
};

async function tryFetchPhoto(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 604800 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (res.ok) return res.arrayBuffer();
    return null;
  } catch {
    return null;
  }
}

function buildUrls(gsgCode: string, huboid: string): string[] {
  const base = `/photo_20260603/Gsg${gsgCode}/Hb${huboid}/gicho/thumbnail.${huboid}`;
  return [
    `https://cdn.nec.go.kr${base}.JPG`,
    `https://cdn.nec.go.kr${base}.JPEG`,
    `http://cdn.nec.go.kr${base}.JPG`,
    `http://cdn.nec.go.kr${base}.JPEG`,
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const huboid = searchParams.get('huboid');
  const gsgCode = searchParams.get('gsgCode');
  const sggName = searchParams.get('sggName');
  const sdName = searchParams.get('sdName');

  if (!huboid || !gsgCode) {
    return new NextResponse('Missing params', { status: 400 });
  }

  // For 구시군의장: resolve exact Gsg code from district name
  let finalGsgCode = gsgCode;
  if (sggName && sdName) {
    const looked = getGsgCode(sggName, sdName);
    if (looked) finalGsgCode = looked;
  }

  for (const url of buildUrls(finalGsgCode, huboid)) {
    const buf = await tryFetchPhoto(url);
    if (buf) return new NextResponse(buf, { headers: IMAGE_HEADERS });
  }

  return new NextResponse('Photo not found', { status: 404 });
}

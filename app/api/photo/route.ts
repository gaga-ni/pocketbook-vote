import { NextRequest, NextResponse } from 'next/server';

const IMAGE_HEADERS = {
  'Content-Type': 'image/jpeg',
  'Cache-Control': 'public, max-age=86400',
};

async function tryFetchPhoto(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (res.ok) return res.arrayBuffer();
    return null;
  } catch {
    return null;
  }
}

function buildUrls(gsgCode: string, huboid: string): string[] {
  const path = `/photo_20260603/Gsg${gsgCode}/Hb${huboid}/gicho/thumbnail.${huboid}.JPG`;
  return [
    `https://cdn.nec.go.kr${path}`,
    `http://cdn.nec.go.kr${path}`,
  ];
}

export async function GET(request: NextRequest) {
  const huboid = request.nextUrl.searchParams.get('huboid');
  const gsgCode = request.nextUrl.searchParams.get('gsgCode');

  if (!huboid || !gsgCode) {
    return new NextResponse('Missing params', { status: 400 });
  }

  // 시도지사 / 교육감 — single gsgCode, try https then http
  if (gsgCode.endsWith('00')) {
    for (const url of buildUrls(gsgCode, huboid)) {
      const buf = await tryFetchPhoto(url);
      if (buf) return new NextResponse(buf, { headers: IMAGE_HEADERS });
    }
    return new NextResponse('Photo not found', { status: 404 });
  }

  // 구시군의장 — try suffixes 01..20, each with https then http
  const sidoCode = gsgCode.slice(0, 2);
  const suffixes = Array.from({ length: 20 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  for (const suffix of suffixes) {
    for (const url of buildUrls(sidoCode + suffix, huboid)) {
      const buf = await tryFetchPhoto(url);
      if (buf) return new NextResponse(buf, { headers: IMAGE_HEADERS });
    }
  }

  return new NextResponse('Photo not found', { status: 404 });
}

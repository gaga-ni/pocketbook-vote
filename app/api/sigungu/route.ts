import { XMLParser } from 'fast-xml-parser';
import { NextRequest, NextResponse } from 'next/server';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get('sido');
  if (!sido) return NextResponse.json({ sigunguList: [] });

  const key = process.env.NEC_API_KEY;
  if (!key) return NextResponse.json({ sigunguList: [] });

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=4` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=300`;

  try {
    const res = await fetch(
      `http://apis.data.go.kr/9760000/CommonCodeService/getCommonSggCodeList?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json({ sigunguList: [] });

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const raw: Record<string, unknown>[] = parsed?.response?.body?.items?.item ?? [];
    // API returns all regions; filter by sdName since sdName param is ignored server-side
    const filtered = raw.filter((item) => String(item.sdName ?? '') === sido);
    const names = [...new Set(filtered.map((item) => String(item.sggName ?? '')).filter(Boolean))];
    const sigunguList = names.sort((a, b) => a.localeCompare(b, 'ko'));

    return NextResponse.json({ sigunguList });
  } catch {
    return NextResponse.json({ sigunguList: [] });
  }
}

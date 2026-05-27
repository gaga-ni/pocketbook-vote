import { XMLParser } from 'fast-xml-parser';
import { NextRequest, NextResponse } from 'next/server';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

const BASE_URL = 'http://apis.data.go.kr/9760000/CommonCodeService/getCommonSggCodeList';

async function fetchAllSigungu(sido: string, key: string): Promise<Record<string, unknown>[]> {
  const allItems: Record<string, unknown>[] = [];
  let pageNo = 1;

  while (true) {
    const qs =
      `serviceKey=${key}` +
      `&sgId=20260603` +
      `&sgTypecode=4` +
      `&sdName=${encodeURIComponent(sido)}` +
      `&numOfRows=100` +
      `&pageNo=${pageNo}`;

    const res = await fetch(`${BASE_URL}?${qs}`, { cache: 'no-store' });
    if (!res.ok) break;

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const items: Record<string, unknown>[] = parsed?.response?.body?.items?.item ?? [];
    if (items.length === 0) break;

    allItems.push(...items);

    const totalCount = Number(parsed?.response?.body?.totalCount ?? 0);
    if (pageNo * 100 >= totalCount) break;
    pageNo++;
  }

  return allItems;
}

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get('sido');
  if (!sido) return NextResponse.json({ sigunguList: [] });

  const key = process.env.NEC_API_KEY;
  if (!key) return NextResponse.json({ sigunguList: [] });

  try {
    const raw = await fetchAllSigungu(sido, key);
    // API returns all regions; filter by sdName since sdName param is ignored server-side
    const filtered = raw.filter((item) => String(item.sdName ?? '') === sido);
    const names = [...new Set(filtered.map((item) => String(item.sggName ?? '')).filter(Boolean))];
    const sigunguList = names.sort((a, b) => a.localeCompare(b, 'ko'));

    return NextResponse.json({ sigunguList });
  } catch {
    return NextResponse.json({ sigunguList: [] });
  }
}

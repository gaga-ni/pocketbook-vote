import { XMLParser } from 'fast-xml-parser';
import { NextRequest, NextResponse } from 'next/server';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get('sido');
  const sgTypecode = request.nextUrl.searchParams.get('sgTypecode');

  if (!sido || !sgTypecode) return NextResponse.json([]);

  const key = process.env.NEC_API_KEY;
  if (!key) return NextResponse.json([]);

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=100` +
    `&pageNo=1`;

  try {
    const res = await fetch(
      `http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json([]);

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const raw: Record<string, unknown>[] = parsed?.response?.body?.items?.item ?? [];

    const candidates = raw.map((item) => ({
      huboid: String(item.huboid ?? ''),
      sgTypecode: String(item.sgTypecode ?? sgTypecode),
      giho: String(item.giho ?? ''),
      name: String(item.name ?? ''),
      jdName: String(item.jdName ?? ''),
      age: String(item.age ?? ''),
      gender: String(item.gender ?? ''),
      birthday: String(item.birthday ?? ''),
      job: String(item.job ?? ''),
      edu: String(item.edu ?? ''),
      career1: String(item.career1 ?? ''),
      career2: String(item.career2 ?? ''),
      sggName: String(item.sggName ?? ''),
      sdName: String(item.sdName ?? ''),
      imgUrl: String(item.imgUrl ?? ''),
    }));

    return NextResponse.json(candidates);
  } catch {
    return NextResponse.json([]);
  }
}

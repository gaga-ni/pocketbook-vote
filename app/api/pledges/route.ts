import { XMLParser } from 'fast-xml-parser';
import { NextRequest, NextResponse } from 'next/server';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

function parsePledgeContent(content: string): { label: string; body: string }[] {
  if (!content) return [];
  const parts = content.split('□').filter((s) => s.trim());
  return parts.map((part) => {
    const newline = part.indexOf('\n');
    if (newline === -1) return { label: part.trim(), body: '' };
    return {
      label: part.slice(0, newline).trim(),
      body: part.slice(newline + 1).trim(),
    };
  });
}

export async function GET(request: NextRequest) {
  const cnddtId = request.nextUrl.searchParams.get('cnddtId');
  const sgTypecode = request.nextUrl.searchParams.get('sgTypecode');

  if (!cnddtId || !sgTypecode) return NextResponse.json([]);

  const key = process.env.NEC_API_KEY;
  if (!key) return NextResponse.json([]);

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&cnddtId=${cnddtId}`;

  try {
    const res = await fetch(
      `http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json([]);

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const items = parsed?.response?.body?.items?.item;
    if (!items) return NextResponse.json([]);

    const raw = (Array.isArray(items) ? items[0] : items) as Record<string, unknown>;
    const count = Math.min(parseInt(String(raw.prmsCnt ?? '0'), 10), 10);

    const pledges = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      const title = String(raw[`prmsTitle${n}`] ?? '');
      const content = String(raw[`prmmCont${n}`] ?? '');
      return { number: n, title, sections: parsePledgeContent(content) };
    }).filter((p) => p.title);

    return NextResponse.json(pledges);
  } catch {
    return NextResponse.json([]);
  }
}

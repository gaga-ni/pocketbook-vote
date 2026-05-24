import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

const BASE = 'http://apis.data.go.kr/9760000';

function serviceKey(): string {
  return process.env.NEC_API_KEY ?? '';
}

export async function fetchCandidates(
  sido: string,
  sgTypecode: string | number
): Promise<Record<string, unknown>[]> {
  const qs =
    `serviceKey=${serviceKey()}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=100` +
    `&pageNo=1`;
  try {
    const res = await fetch(
      `${BASE}/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    return parsed?.response?.body?.items?.item ?? [];
  } catch {
    return [];
  }
}

export async function fetchPledges(
  cnddtId: string,
  sgTypecode: string
): Promise<Record<string, unknown> | null> {
  const qs =
    `serviceKey=${serviceKey()}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&cnddtId=${cnddtId}`;
  try {
    const res = await fetch(
      `${BASE}/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const items = parsed?.response?.body?.items?.item;
    if (!items) return null;
    return Array.isArray(items) ? items[0] : items;
  } catch {
    return null;
  }
}

export async function fetchSigungu(
  sido: string
): Promise<Record<string, unknown>[]> {
  const qs =
    `serviceKey=${serviceKey()}` +
    `&sgId=20260603` +
    `&sgTypecode=4` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=300`;
  try {
    const res = await fetch(
      `${BASE}/CommonCodeService/getCommonSggCodeList?${qs}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    return parsed?.response?.body?.items?.item ?? [];
  } catch {
    return [];
  }
}

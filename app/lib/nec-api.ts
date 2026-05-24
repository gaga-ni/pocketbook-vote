import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser({ isArray: (name) => name === 'item' });

const CANDIDATE_API =
  'http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire';
const PLEDGE_API =
  'http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire';
const SIGUNGU_API =
  'http://apis.data.go.kr/9760000/CommonCodeService/getCommonSggCodeList';

export interface Candidate {
  huboid: string;
  sgTypecode: string;
  giho: string;
  name: string;
  jdName: string;
  age: string;
  gender: string;
  birthday: string;
  job: string;
  edu: string;
  career1: string;
  career2: string;
  sggName: string;
  sdName: string;
  imgUrl: string;
}

export interface PledgeSection {
  label: string;
  body: string;
}

export interface PledgeItem {
  number: number;
  title: string;
  sections: PledgeSection[];
}

export async function fetchCandidatesByType(
  sido: string,
  sgTypecode: number
): Promise<Candidate[]> {
  const key = process.env.NEC_API_KEY;
  if (!key) return [];

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=100` +
    `&pageNo=1`;

  try {
    const res = await fetch(`${CANDIDATE_API}?${qs}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const raw: Record<string, unknown>[] = parsed?.response?.body?.items?.item ?? [];
    return raw.map((item) => ({
      huboid: String(item.huboid ?? ''),
      sgTypecode: String(item.sgTypecode ?? ''),
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
  } catch {
    return [];
  }
}

export async function fetchSigunguList(sido: string): Promise<string[]> {
  const key = process.env.NEC_API_KEY;
  if (!key) return [];

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=4` +
    `&sdName=${encodeURIComponent(sido)}` +
    `&numOfRows=300`;

  try {
    const res = await fetch(`${SIGUNGU_API}?${qs}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const raw: Record<string, unknown>[] = parsed?.response?.body?.items?.item ?? [];
    const filtered = raw.filter((item) => String(item.sdName ?? '') === sido);
    const names = [...new Set(filtered.map((item) => String(item.sggName ?? '')).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b, 'ko'));
  } catch {
    return [];
  }
}

export async function findCandidateWithType(
  sido: string,
  cnddtId: string
): Promise<{ candidate: Candidate | null; sgTypecode: string }> {
  const [c3, c4, c11] = await Promise.all([
    fetchCandidatesByType(sido, 3),
    fetchCandidatesByType(sido, 4),
    fetchCandidatesByType(sido, 11),
  ]);

  for (const [t, list] of [
    ['3', c3],
    ['4', c4],
    ['11', c11],
  ] as [string, Candidate[]][]) {
    const found = list.find((c) => c.huboid === cnddtId);
    if (found) return { candidate: found, sgTypecode: t };
  }
  return { candidate: null, sgTypecode: '3' };
}

export async function fetchPledges(
  cnddtId: string,
  sgTypecode: string
): Promise<PledgeItem[]> {
  const key = process.env.NEC_API_KEY;
  if (!key) return [];

  const qs =
    `serviceKey=${key}` +
    `&sgId=20260603` +
    `&sgTypecode=${sgTypecode}` +
    `&cnddtId=${cnddtId}`;

  try {
    const res = await fetch(`${PLEDGE_API}?${qs}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const items = parsed?.response?.body?.items?.item;
    if (!items) return [];
    const raw = (Array.isArray(items) ? items[0] : items) as Record<string, unknown>;
    const count = Math.min(parseInt(String(raw.prmsCnt ?? '0'), 10), 10);
    return Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      const title = String(raw[`prmsTitle${n}`] ?? '');
      const content = String(raw[`prmmCont${n}`] ?? '');
      return { number: n, title, sections: parsePledgeContent(content) };
    }).filter((p) => p.title);
  } catch {
    return [];
  }
}

export function parsePledgeContent(content: string): PledgeSection[] {
  if (!content) return [];
  // Split on □ (U+25A1); first line of each segment is the section label
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

export function getElectionLabel(
  sgTypecode: string,
  sdName: string,
  sggName: string
): string {
  if (sgTypecode === '11') return `${sdName} 교육감 후보`;
  if (sgTypecode === '4') {
    if (sggName.endsWith('구')) return `${sggName}청장 후보`;
    if (sggName.endsWith('군')) return `${sggName}수 후보`;
    return `${sggName}장 후보`;
  }
  if (sdName.endsWith('도')) return `${sdName}지사 후보`;
  return `${sdName}장 후보`;
}

export function formatBirthday(birthday: string): string {
  if (!birthday || birthday.length !== 8) return birthday;
  return `${birthday.slice(0, 4)}년 ${birthday.slice(4, 6)}월 ${birthday.slice(6, 8)}일`;
}

export function formatBirthdayDot(birthday: string): string {
  if (!birthday || birthday.length !== 8) return birthday;
  return `${birthday.slice(0, 4)}.${birthday.slice(4, 6)}.${birthday.slice(6, 8)}`;
}

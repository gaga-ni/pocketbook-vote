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

// Construct absolute base URL for internal API calls from server components.
// NEXT_PUBLIC_BASE_URL must be set in Vercel env vars (e.g. https://your-app.vercel.app).
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function fetchCandidatesByType(
  sido: string,
  sgTypecode: number
): Promise<Candidate[]> {
  try {
    const url =
      `${getBaseUrl()}/api/candidates` +
      `?sido=${encodeURIComponent(sido)}&sgTypecode=${sgTypecode}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json() as Promise<Candidate[]>;
  } catch {
    return [];
  }
}

export async function fetchSigunguList(sido: string): Promise<string[]> {
  try {
    const url = `${getBaseUrl()}/api/sigungu?sido=${encodeURIComponent(sido)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json() as { sigunguList: string[] };
    return data.sigunguList ?? [];
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
  try {
    const url =
      `${getBaseUrl()}/api/pledges` +
      `?cnddtId=${cnddtId}&sgTypecode=${sgTypecode}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json() as Promise<PledgeItem[]>;
  } catch {
    return [];
  }
}

export function parsePledgeContent(content: string): PledgeSection[] {
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

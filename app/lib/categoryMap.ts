import type { PledgeItem } from './nec-api';

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '교통': { bg: '#E8F4FD', text: '#1A6FA8' },
  '청년': { bg: '#FFF0E8', text: '#C45B00' },
  '주거': { bg: '#E8FDF0', text: '#1A7A3E' },
  '복지': { bg: '#F0E8FD', text: '#6B1FA8' },
  '교육': { bg: '#FDF8E8', text: '#8A6500' },
  '경제': { bg: '#E8FDFD', text: '#1A7A7A' },
  '환경': { bg: '#EDFDE8', text: '#2A7A1A' },
  '문화': { bg: '#FDE8F5', text: '#A81F6B' },
  '안전': { bg: '#FDE8E8', text: '#A81F1F' },
  '행정': { bg: '#EFEFEF', text: '#5e5e5e' },
};

const CATEGORY_KEYWORDS: [string, string[]][] = [
  ['교통', ['교통', '버스', '철도', '지하철', '도로', '주차', 'GTX']],
  ['청년', ['청년', '취업', '창업']],
  ['주거', ['주거', '주택', '전세', '임대']],
  ['복지', ['복지', '돌봄', '노인', '장애', '의료', '보건']],
  ['교육', ['교육', '학교', '학생']],
  ['경제', ['경제', '산업', '기업', '일자리']],
  ['환경', ['환경', '기후', '녹지', '공원']],
  ['문화', ['문화', '체육', '관광', '예술']],
  ['안전', ['안전', '치안', '소방', '재난']],
];

export function getPledgeCategory(pledge: PledgeItem): string {
  const text =
    pledge.title +
    (pledge.sections[0]?.label ?? '') +
    (pledge.sections[0]?.body ?? '').slice(0, 50);
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) return category;
  }
  return '행정';
}

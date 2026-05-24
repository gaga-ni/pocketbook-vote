const SIDO_CODES: Record<string, string> = {
  '서울특별시': '11',
  '부산광역시': '26',
  '대구광역시': '27',
  '인천광역시': '28',
  '광주광역시': '29',
  '대전광역시': '30',
  '울산광역시': '31',
  '세종특별자치시': '36',
  '경기도': '41',
  '강원특별자치도': '51',
  '충청북도': '43',
  '충청남도': '44',
  '전북특별자치도': '52',
  '전라남도': '46',
  '경상북도': '47',
  '경상남도': '48',
  '제주특별자치도': '50',
};

export function getCandidatePhotoUrl(
  huboid: string,
  sdName: string,
  sgTypecode: string
): string {
  const sidoCode = SIDO_CODES[sdName] ?? '11';
  const suffix = sgTypecode === '4' ? '01' : '00';
  const gsgCode = sidoCode + suffix;
  return `/api/photo?huboid=${huboid}&gsgCode=${gsgCode}`;
}

const PARTY_COLORS: Record<string, { main: string; sub: string }> = {
  '더불어민주당': { main: '#152484', sub: '#D7E1FF' },
  '국민의힘': { main: '#E61E2B', sub: '#FFDED6' },
  '개혁신당': { main: '#FF7210', sub: '#FFE4D1' },
  '진보당': { main: '#E60020', sub: '#FFDADF' },
  '국민연합': { main: '#EC008B', sub: '#FFDEF5' },
  '여성의당': { main: '#6400AA', sub: '#F4E0FF' },
  '자유통일당': { main: '#D33C3B', sub: '#FFDEDE' },
  '정의당': { main: '#FFED00', sub: '#FFFBC9' },
  '조국혁신당': { main: '#004098', sub: '#DBEFFF' },
  '노동당': { main: '#FF0000', sub: '#FFDCDC' },
  '기본소득당': { main: '#00D2C3', sub: '#E8FFFD' },
  '새미래민주당': { main: '#51BDC5', sub: '#E8FDFF' },
  '자유와혁신': { main: '#A50034', sub: '#FFEDF3' },
  '녹색당': { main: '#5CB531', sub: '#ECFFE3' },
  '국민당': { main: '#E61E2B', sub: '#FFE6E8' },
};

const LIGHT_PARTIES = new Set(['정의당', '기본소득당', '새미래민주당', '녹색당']);

export function getPartyStyle(partyName: string): { color: string; backgroundColor: string } {
  const party = PARTY_COLORS[partyName];
  if (!party) return { backgroundColor: '#222222', color: '#ffffff' };
  return {
    backgroundColor: party.main,
    color: LIGHT_PARTIES.has(partyName) ? '#000000' : '#ffffff',
  };
}

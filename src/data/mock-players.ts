import type { PlayerSummary } from '../types/player';

/** 화면 설계용 Mock 데이터. 추후 API 연동 시 교체 */
export const mockPlayers: PlayerSummary[] = [
  {
    name: '용쿠리몽#KR1',
    normal: { games: 5, win: 3, lose: 2, hansimScore: 42, kda: '3.1' },
    solo: { games: 2, win: 0, lose: 2, hansimScore: 88, kda: '1.2' },
  },
  {
    name: 'hiYong94#KR1',
    normal: { games: 4, win: 4, lose: 0, hansimScore: 10, kda: '4.5' },
    flex: { games: 3, win: 1, lose: 2, hansimScore: 67, kda: '2.0' },
  },
];

/** 소환사 필터: 전체 vs 개별 선택 */
export enum SummonerFilter {
  ALL = '__ALL__',
}

/** 큐 타입 (값은 API·CSS와 호환되는 소문자 유지) */
export enum QueueType {
  NORMAL = 'normal',
  SOLO = 'solo',
  FLEX = 'flex',
}

export type QueueKey = QueueType;

export type QueueSummary = {
  games: number;
  win: number;
  lose: number;
  hansimScore: number;
  kda?: string;
};

export type PlayerSummary = {
  name: string;
  normal?: QueueSummary;
  solo?: QueueSummary;
  flex?: QueueSummary;
};

export const QUEUE_OPTIONS: { value: QueueType; label: string }[] = [
  { value: QueueType.NORMAL, label: '일반(400/430)' },
  { value: QueueType.SOLO, label: '솔로랭크(420)' },
  { value: QueueType.FLEX, label: '자유랭크(440)' },
];

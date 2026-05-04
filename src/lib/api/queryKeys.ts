/**
 * Query Key Factory
 * React Query 캐시 키를 체계적으로 관리
 */

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

export const summonerKeys = {
  all: ['summoner'] as const,
  lists: () => [...summonerKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...summonerKeys.lists(), filters] as const,
  details: () => [...summonerKeys.all, 'detail'] as const,
  detail: (name: string) => [...summonerKeys.details(), name] as const,
  stats: (name: string) => [...summonerKeys.detail(name), 'stats'] as const,
  summary: (riotId: string, query?: Record<string, any>) =>
    [...summonerKeys.all, 'summary', riotId, query] as const,
  batchSummary: (riotIds: string[], startDate?: string, endDate?: string) =>
    [...summonerKeys.all, 'batch-summary', riotIds.sort().join(','), { startDate, endDate }] as const,
};

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  lists: () => [...leaderboardKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) =>
    [...leaderboardKeys.lists(), { page, pageSize }] as const,
  realtime: (limit: number) => [...leaderboardKeys.all, 'realtime', limit] as const,
};

export const matchKeys = {
  all: ['match'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (summonerName: string, filters?: Record<string, any>) =>
    [...matchKeys.lists(), summonerName, filters] as const,
  detail: (matchId: string) => [...matchKeys.all, 'detail', matchId] as const,
};

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../client';
import { leaderboardKeys } from '../queryKeys';

/**
 * 리더보드 플레이어 타입
 */
export interface LeaderboardPlayer {
  rank: number;
  name: string;
  tier: string;
  lp: number;
  score: number;
  avatarUrl: string;
}

export interface LeaderboardResponse {
  players: LeaderboardPlayer[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 리더보드 조회
 */
export function useLeaderboard(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: leaderboardKeys.list(page, pageSize),
    queryFn: () =>
      apiGet<LeaderboardResponse>('/api/v1/leaderboard', {
        params: { page, pageSize },
      }),
  });
}

/**
 * 실시간 리더보드 (자동 갱신)
 */
export function useRealtimeLeaderboard(limit = 10) {
  return useQuery({
    queryKey: leaderboardKeys.realtime(limit),
    queryFn: () =>
      apiGet<LeaderboardResponse>('/api/v1/leaderboard/realtime', {
        params: { limit },
      }),
    refetchInterval: 60000, // 1분마다 자동 갱신
  });
}

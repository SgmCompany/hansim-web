import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import type { LinkSummonerRequest } from '../services/userService';
import { userKeys } from '../queryKeys';
import * as userService from '../services/userService';

export function useMe() {
  const { status } = useSession();

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
    // 세션에 accessToken이 늦게 채워지거나, localStorage 폴백만 있는 경우에도 조회 시도
    enabled: status === 'authenticated',
    staleTime: 60_000,
  });
}

export function useLinkSummoner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LinkSummonerRequest) => userService.linkSummoner(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useUnlinkSummoner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.unlinkSummoner(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

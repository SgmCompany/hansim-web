import type { components } from '@/src/types/api.generated';

type Queues = components['schemas']['Queues'];
type QueueInfo = components['schemas']['QueueInfo'];

/** 솔로 → 자유 → 일반 순으로, 게임 수가 1판 이상인 첫 큐를 대표 통계로 사용합니다. */
export function getPrimaryQueue(queues: Queues): QueueInfo | undefined {
  const keys: (keyof Queues)[] = ['solo', 'flex', 'normal'];
  for (const key of keys) {
    const q = queues[key];
    if (q && q.games > 0) return q;
  }
  return undefined;
}

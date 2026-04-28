'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addRecentSummonersFromSearch,
  loadRecentSummoners,
  removeRecentSummoner,
} from '@/src/utils/recentSummoners';

export function useRecentSummoners() {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadRecentSummoners());
    setReady(true);
  }, []);

  const record = useCallback((normalizedNames: string[]) => {
    setItems(addRecentSummonersFromSearch(normalizedNames));
  }, []);

  const remove = useCallback((riotId: string) => {
    setItems(removeRecentSummoner(riotId));
  }, []);

  return { items, record, remove, ready };
}

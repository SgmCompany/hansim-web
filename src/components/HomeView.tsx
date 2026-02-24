'use client';

import { useMemo, useState } from 'react';
import type { PlayerSummary, QueueKey } from '../types/player';
import { QUEUE_OPTIONS, SummonerFilter, QueueType } from '../types/player';
import { QueueSection } from './QueueSection';

type HomeViewProps = {
  players: PlayerSummary[];
  periodStr: string;
};

export function HomeView({ players, periodStr }: HomeViewProps) {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;
  const [summoner, setSummoner] = useState<string>(SummonerFilter.ALL);
  const [queue, setQueue] = useState<'all' | QueueKey>('all');

  // ---- derived: 소환사 목록 ----
  const names = useMemo(() => Array.from(new Set(players.map((p) => p.name))), [players]);

  // ---- derived: 필터 적용된 카드 목록 ----
  const filteredCards = useMemo(() => {
    return players.filter((p) => {
      const passName = summoner === SummonerFilter.ALL || p.name === summoner;
      const hasNormal = Boolean(p.normal?.games);
      const hasSolo = Boolean(p.solo?.games);
      const hasFlex = Boolean(p.flex?.games);
      const passQueue =
        queue === 'all'
          ? hasNormal || hasSolo || hasFlex
          : queue === QueueType.NORMAL
            ? hasNormal
            : queue === QueueType.SOLO
              ? hasSolo
              : hasFlex;
      return passName && passQueue;
    });
  }, [players, summoner, queue]);

  // ---- render ----
  return (
    <div className="hansim-root">
      <div className="wrap">
        {/* ---- 헤더: 로고 ---- */}
        <div className="logo">
          <img src={logoUrl} alt="SGM Company 로고" />
        </div>

        {/* ---- 헤더: 제목, 집계 기간 ---- */}
        <h1>한심지수 · 전적 요약</h1>
        <div className="period">{periodStr}</div>

        {/* ---- 필터: 소환사 / 큐 타입 ---- */}
        <div className="filters">
          <div className="field">
            <label htmlFor="summoner">소환사</label>
            <select
              id="summoner"
              value={summoner}
              onChange={(e) => setSummoner(e.target.value)}
              aria-label="소환사 선택"
            >
              <option value={SummonerFilter.ALL}>전체</option>
              {names.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="queue">큐 타입</label>
            <select
              id="queue"
              value={queue}
              onChange={(e) =>
                setQueue((e.target.value === 'all' ? 'all' : e.target.value) as 'all' | QueueKey)
              }
              aria-label="큐 타입 선택"
            >
              <option value="all">전체</option>
              {QUEUE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- 카드 그리드 ---- */}
        <div className="grid" id="cards">
          {filteredCards.map((p) => (
            <article
              key={p.name}
              className="card"
              data-has-normal={String(Boolean(p.normal?.games))}
              data-has-solo={String(Boolean(p.solo?.games))}
              data-has-flex={String(Boolean(p.flex?.games))}
            >
              <div className="name">{p.name}</div>
              <QueueSection title="일반(400/430)" queueKey={QueueType.NORMAL} summary={p.normal} />
              <QueueSection title="솔로랭크(420)" queueKey={QueueType.SOLO} summary={p.solo} />
              <QueueSection title="자유랭크(440)" queueKey={QueueType.FLEX} summary={p.flex} />
            </article>
          ))}
        </div>

        {/* ---- 푸터 ---- */}
        <footer>매일 06:00(KST) 기준 집계 · hansim-web</footer>
      </div>
    </div>
  );
}

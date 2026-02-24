import type { QueueKey, QueueSummary } from '../types/player';

type Props = {
  title: string;
  queueKey: QueueKey;
  summary?: QueueSummary;
};

export function QueueSection({ title, queueKey, summary: s }: Props) {
  if (!s || !s.games) return null;

  // ---- render: 큐별 섹션 (라벨, 메타, 핏) ----
  return (
    <div className={`section section-${queueKey}`}>
      <div className="label">{title}</div>
      <div className="meta">
        {s.games}게임 · {s.win}승 {s.lose}패
      </div>
      <div className="row">
        <span className="pill">한심지수: {s.hansimScore}</span>
        {s.kda != null ? <span className="pill">KDA: {s.kda}</span> : null}
      </div>
    </div>
  );
}

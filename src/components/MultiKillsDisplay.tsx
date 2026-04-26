import type { components } from '@/src/types/api.generated';

export type MultiKills = components['schemas']['MultiKills'];

export function multiKillsHasAny(m: MultiKills): boolean {
  return m.doubles + m.triples + m.quadras + m.pentas > 0;
}

type InlineProps = {
  multiKills: MultiKills;
  /** 큐 카드 안: 한 줄 D/T/Q/P */
  compact?: boolean;
};

export function MultiKillsInline({ multiKills, compact }: InlineProps) {
  if (compact) {
    const items = [
      { k: 'D', v: multiKills.doubles },
      { k: 'T', v: multiKills.triples },
      { k: 'Q', v: multiKills.quadras },
      { k: 'P', v: multiKills.pentas },
    ];
    return (
      <div
        className="flex items-center justify-between gap-1 sm:gap-2 text-[0.7rem] sm:text-xs font-black tabular-nums"
        title="더블/트리플/쿼드라/펜타"
      >
        {items.map(({ k, v }) => (
          <span key={k} className="flex items-baseline gap-0.5">
            <span className="text-on-surface-variant font-bold text-[0.65rem]">{k}</span>
            <span className="text-on-surface">{v}</span>
          </span>
        ))}
      </div>
    );
  }

  const cells: { label: string; value: number }[] = [
    { label: '더블', value: multiKills.doubles },
    { label: '트리', value: multiKills.triples },
    { label: '쿼드', value: multiKills.quadras },
    { label: '펜타', value: multiKills.pentas },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {cells.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl bg-surface-container-low/80 px-1 py-1.5 sm:px-2 sm:py-2 text-center min-w-0"
        >
          <div className="text-[0.6rem] sm:text-[0.65rem] font-bold text-on-surface-variant leading-tight">
            {label}
          </div>
          <div className="text-xs sm:text-sm font-black text-on-surface tabular-nums leading-tight">{value}</div>
        </div>
      ))}
    </div>
  );
}

type MultiKillsCardProps = {
  multiKills: MultiKills;
  hideWhenEmpty?: boolean;
  subtitle?: string;
  className?: string;
};

export function MultiKillsCard({ multiKills, hideWhenEmpty, subtitle, className = '' }: MultiKillsCardProps) {
  if (hideWhenEmpty && !multiKillsHasAny(multiKills)) return null;

  return (
    <section
      className={`bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-6 no-line-boundary shadow-sm mb-4 sm:mb-6 ${className}`.trim()}
      aria-label="멀티킬"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="material-symbols-outlined text-primary text-lg filled shrink-0">bolt</span>
        <h2 className="text-xs sm:text-sm font-black text-on-surface tracking-wide">멀티킬</h2>
        <span className="text-[0.65rem] text-on-surface-variant font-semibold ml-auto tabular-nums" aria-hidden>
          D·T·Q·P
        </span>
      </div>
      <p className="text-[0.65rem] sm:text-xs font-medium text-on-surface-variant mb-3 leading-snug">
        {subtitle ?? '대표 큐 누적'}
      </p>
      <MultiKillsInline multiKills={multiKills} />
    </section>
  );
}

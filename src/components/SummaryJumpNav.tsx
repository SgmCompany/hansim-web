'use client';

const SECTIONS = [
  { id: 'summary-section-hls', label: '등급 안내' },
  { id: 'summary-section-leaderboard', label: '한심왕' },
  { id: 'summary-section-detail', label: '상세 비교' },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** 멀티 요약 페이지 — 긴 스크롤 완화용 구역 이동(스티키) */
export function SummaryJumpNav() {
  return (
    <nav
      aria-label="페이지 구역 이동"
      className="sticky z-40 flex flex-wrap justify-center gap-1.5 sm:gap-2 rounded-sm border border-outline-variant/15 bg-surface-container-lowest/95 backdrop-blur-md px-2 py-2 shadow-sm -mx-0.5 sm:mx-0 top-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:top-[calc(5.5rem+env(safe-area-inset-top,0px))]"
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToSection(id)}
          className="inline-flex items-center gap-1 rounded-md bg-surface-container px-3 py-1.5 text-xs sm:text-sm font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

'use client';

import {
  useChampions,
  getChampionNameById,
  getChampionKeyById,
} from '@/src/lib/ddragon/hooks/useChampions';
import { getChampionImageUrl, useLatestVersion } from '@/src/lib/ddragon';
import type { components } from '@/src/types/api.generated';
import { getLolPositionKorean } from '@/src/utils/lolPosition';

type Champion = components['schemas']['Champion'];

export type TopChampionsStripProps = {
  champions: Champion[];
  /**
   * nested: 요약 PlayerCard처럼 surface-container-lowest 안
   * page: 소환사 상세처럼 bg-surface 위 — 페이드 그라데이션 색만 맞춤
   */
  surface?: 'nested' | 'page';
  className?: string;
};

export function TopChampionsStrip({ champions, surface = 'nested', className = '' }: TopChampionsStripProps) {
  const { data: championsData } = useChampions();
  const { data: version } = useLatestVersion();

  if (!champions?.length) return null;

  const fadeFrom = surface === 'page' ? 'from-surface' : 'from-surface-container-lowest';

  return (
    <div className={`relative min-w-0 ${className}`.trim()}>
      <h3 className="text-[0.65rem] font-bold text-on-surface-variant mb-2 tracking-wide">
        챔피언
      </h3>
      <div className="relative">
        <div
          className="summary-touch-scroll-x flex gap-2 sm:gap-3 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-outline/60 scrollbar-track-transparent scroll-smooth touch-pan-x max-sm:scroll-pl-0 max-sm:scroll-pr-3"
          style={{ touchAction: 'pan-x' }}
        >
          {champions.map((champion) => {
            const championKey = getChampionKeyById(champion.championId, championsData);
            const championName = getChampionNameById(champion.championId, championsData);

            return (
              <div
                key={champion.championId}
                className="bg-surface-container p-3 sm:p-4 rounded-2xl text-center w-[min(7.75rem,calc((100vw-3.5rem)/2))] sm:min-w-[7.5rem] sm:max-w-[8.5rem] sm:w-auto shrink-0 snap-start"
              >
                {championKey && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 rounded-xl overflow-hidden">
                    <img
                      src={getChampionImageUrl(championKey, version)}
                      alt={championName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="font-black text-on-surface mb-1 text-sm sm:text-base truncate leading-tight">
                  {championName}
                </p>
                <p className="text-[0.65rem] sm:text-xs font-bold text-on-surface-variant leading-snug">
                  {[
                    getLolPositionKorean(champion.topPosition),
                    `${champion.games}판`,
                    `${champion.winRate}%`,
                    champion.kda,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            );
          })}
        </div>
        {champions.length > 3 && (
          <div
            className={`absolute right-0 top-0 bottom-2 w-20 bg-linear-to-l ${fadeFrom} to-transparent pointer-events-none`}
          />
        )}
      </div>
    </div>
  );
}

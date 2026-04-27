import type { LanePreferenceSummary } from '@/src/utils/lanePreference';
import { LanePreferenceBlurb } from '@/src/components/LanePreferenceBlurb';

type SummonerProfileProps = {
  className?: string;
  lanePreference?: LanePreferenceSummary | null;
  summoner: {
    name: string;
    level: number;
    region: string;
    avatarUrl: string;
    tier: string;
    rank?: string;
    lp: number;
    winStreak: number;
    tierColor: string;
    soloRank?: {
      tier: string;
      rank: string;
      lp: number;
    };
    flexRank?: {
      tier: string;
      rank: string;
      lp: number;
    };
    streak?: {
      type: string;
      count: number;
    };
  };
};

export function SummonerProfile({
  summoner,
  lanePreference,
  className = 'mb-4 sm:mb-5',
}: SummonerProfileProps) {
  const getStreakText = () => {
    if (!summoner.streak || summoner.streak.type === 'NONE') return null;
    const type = summoner.streak.type === 'WIN' ? '연승' : '연패';
    return `${summoner.streak.count}${type} 중`;
  };

  return (
    <header
      className={`bg-surface-container-lowest p-4 sm:p-6 rounded-2xl sm:rounded-3xl no-line-boundary ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-surface-container overflow-hidden">
            <img
              src={summoner.avatarUrl}
              alt={`${summoner.name} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-xs font-black px-2 py-1 rounded-full">
            Lv. {summoner.level}
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h1 className="text-lg sm:text-2xl font-black text-on-surface mb-1.5 wrap-break-word leading-tight">
            {summoner.name}
          </h1>

          {/* 랭크 정보 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2 mb-2">
            {summoner.soloRank && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">솔로</span>
                <span className={`font-black ${summoner.tierColor}`}>
                  {summoner.soloRank.tier} {summoner.soloRank.rank}
                </span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {summoner.soloRank.lp} LP
                </span>
              </div>
            )}
            {summoner.flexRank && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">자유</span>
                <span className={`font-black ${summoner.tierColor}`}>
                  {summoner.flexRank.tier} {summoner.flexRank.rank}
                </span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {summoner.flexRank.lp} LP
                </span>
              </div>
            )}
          </div>

          <LanePreferenceBlurb summary={lanePreference} />

          {/* 스트릭 */}
          {getStreakText() && (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black ${
              summoner.streak?.type === 'WIN'
                ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                : 'bg-red-500/20 text-red-700 border border-red-500/30'
            }`}>
              <span className="material-symbols-outlined icon-sm">
                {summoner.streak?.type === 'WIN' ? 'trending_up' : 'trending_down'}
              </span>
              {getStreakText()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

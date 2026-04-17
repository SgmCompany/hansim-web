type SummonerProfileProps = {
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

export function SummonerProfile({ summoner }: SummonerProfileProps) {
  const getStreakText = () => {
    if (!summoner.streak || summoner.streak.type === 'NONE') return null;
    const type = summoner.streak.type === 'WIN' ? '연승' : '연패';
    return `${summoner.streak.count}${type} 중`;
  };

  return (
    <header className="bg-surface-container-lowest p-8 rounded-3xl no-line-boundary mb-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-surface-container overflow-hidden">
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

        <div className="flex-1">
          <h1 className="text-3xl font-black text-on-surface mb-2">{summoner.name}</h1>
          
          {/* 랭크 정보 */}
          <div className="flex gap-4 mb-2">
            {summoner.soloRank && (
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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

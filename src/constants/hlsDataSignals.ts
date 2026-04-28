import type { HlsDetailKey } from '@/src/utils/hlsDetailPresentation';
import { HLS_DETAIL_ROWS } from '@/src/utils/hlsDetailPresentation';

/** API·기획서 기준: 현재 UI에 노출되는 HLS는 NINE_TO_SIX 가정 산출 */
export const HLS_SCORE_MODEL = 'NINE_TO_SIX (직장인 기준)';

const SIGNAL_COPY: Record<HlsDetailKey, string> = {
  volume: 'Riot 매치 합산 기준 총 플레이 시간·판 수 등 볼륨 신호에서 나옵니다.',
  result: '승·패, KDA, 서렌(gg)·15서렌(15gg) 등 해당 기간 매치 결과에서 나옵니다.',
  lateNight: 'KST 심야 시간대 플레이 비중에서 반영됩니다.',
  weekend: '토·일 시간대 플레이 분에 비중이 들어갑니다.',
  session: '짧은 간격으로 이어진 세션·최장 연속 플레이 길이 등에서 계산합니다.',
  losingStreak: '그날의 연패 흐름(최대 연속 패 등)에서 나옵니다.',
  tilt: '패배 직후 짧은 간격 안에 다시 큐를 잡은 흐름을 추정해 반영합니다.',
};

/** 모델 순서 유지된 안내 목록 */
export function getHlsDataSignalEntries(): { emoji: string; label: string; hint: string }[] {
  return HLS_DETAIL_ROWS.map((row) => ({
    emoji: row.emoji,
    label: row.label,
    hint: SIGNAL_COPY[row.key],
  }));
}

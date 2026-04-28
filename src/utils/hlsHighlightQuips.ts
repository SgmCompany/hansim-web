import type { components } from '@/src/types/api.generated';
import {
  getHlsDetailRowViews,
  type HlsDetailKey,
} from '@/src/utils/hlsDetailPresentation';

type HlsDetail = components['schemas']['HlsDetail'];

/** 핵심 요인 멘트 1~2개 (부분 점수 기반, 셀프디스 톤) */
export function getHlsHighlightQuips(detail: HlsDetail | undefined): string[] {
  if (!detail) return [];

  const rows = getHlsDetailRowViews(detail);
  const score = (key: HlsDetailKey) => rows.find((r) => r.key === key)?.score ?? 0;

  const ls = score('losingStreak');
  const tilt = score('tilt');
  const late = score('lateNight');
  const vol = score('volume');
  const weekend = score('weekend');
  const session = score('session');
  const result = score('result');

  const candidates: string[] = [];

  if (ls >= 7 && tilt >= 3) {
    candidates.push('패배를 인정 못 하는 스타일이시군요. 오늘 키보드 무사한가요?');
  } else {
    if (ls >= 8) {
      candidates.push('연패에 연패… 오늘은 그만할 타이밍이었을지도요.');
    }
    if (tilt >= 4) {
      candidates.push('바로 다음 판? 마음은 이해하지만 PC는 소중하니까요.');
    }
  }

  if (late >= 12) {
    candidates.push('새벽에 뭘 하신 건가요. 내일 출근은 하실 수 있나요?');
  }
  if (vol >= 27) {
    candidates.push('플레이량이 압도적이에요. 오늘 야근은… 없으셨나요?');
  }
  if (weekend >= 8) {
    candidates.push('주말을 이렇게까지. 달력이 슬퍼합니다.');
  }
  if (session >= 8) {
    candidates.push('한 세션에 몰아치기 장인이시네요. 자리 좀 풀고 오셨나요?');
  }
  if (result >= 16) {
    candidates.push('결과 점수가 높아요 — 데보나 서렌이 많이 섞였던 하루였나요?');
  }

  const unique = dedupeLines(candidates).slice(0, 2);

  if (unique.length >= 2) {
    return unique;
  }

  if (unique.length === 1) {
    return unique;
  }

  const sorted = [...rows].sort((a, b) => b.score / b.max - a.score / a.max);
  const top = sorted.find((r) => r.score > 0 && r.score / r.max >= 0.55);
  if (top) {
    const line = singleDimensionFallback(top.key, top.score, top.max);
    return line ? [line] : [];
  }

  return [];
}

function dedupeLines(lines: string[]): string[] {
  const seen = new Set<string>();
  return lines.filter((l) => {
    const t = l.trim();
    if (!t || seen.has(t)) return false;
    seen.add(t);
    return true;
  });
}

function singleDimensionFallback(key: HlsDetailKey, s: number, max: number): string {
  const ratio = s / max;
  switch (key) {
    case 'volume':
      return ratio >= 0.75
        ? '플레이량이 무섭습니다. 의자 등받이 체크 한번요.'
        : '플레이량이 제법이에요. 스트레칭은 하셨나요?';
    case 'lateNight':
      return '심야 로그인이 많아요. 수면 채권이 연체됐을지도요.';
    case 'weekend':
      return '주말 몰빵이에요. 월요일의 당신을 생각해 주세요.';
    case 'session':
      return '긴 세션이에요. 물은 마셨나요?';
    case 'losingStreak':
      return '연패가 제법이에요. 오늘은 여기까지가 답일 수도요.';
    case 'tilt':
      return '바로 재큐는… 감정 온도를 좀 내려 보시죠.';
    case 'result':
      return '점수표가 말이 많아요. 다음 판은 조금 가볍게요.';
    default:
      return '';
  }
}

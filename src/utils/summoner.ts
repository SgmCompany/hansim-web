/**
 * 소환사명에서 # 을 - 로 변환 (API 전송용)
 * @example "용쿠리몽#KR1" → "용쿠리몽-KR1"
 */
export function parseSummonerNameForApi(name: string): string {
  return name.replace(/#/g, '-');
}

/**
 * 소환사명 형식 검증 (게임이름#태그)
 */
export function isValidSummonerFormat(name: string): boolean {
  return /^.+#[A-Z0-9]+$/i.test(name.trim());
}

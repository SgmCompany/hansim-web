/** 시안·백엔드 연동 시 동일 enum 유지 권장 */
export type WorkTypeId = 'NINE_TO_SIX' | 'PART_TIME' | 'STUDENT' | 'FAIR_24H' | 'UNEMPLOYED';

export type IncomeInputKind = 'SALARY' | 'HOURLY' | 'NONE';

export const WORK_TYPE_LABELS: Record<WorkTypeId, string> = {
  NINE_TO_SIX: '9 to 6 직장인',
  PART_TIME: '시간제 알바',
  STUDENT: '학생 (고등학생/대학생)',
  FAIR_24H: '교대/야간 근무',
  UNEMPLOYED: '백수/휴직자',
};

const WEIGHTS_LINE_OFFICE =
  '볼륨 30% · 결과 20% · 심야 15% · 주말 10% · 세션 10% · 연패 10% · 틸트재큐 5%';

const WEIGHTS_LINE_STANDARD =
  '볼륨 35% · 결과 25% · 세션 15% · 연패 10% · 틸트재큐 10% · 파편화 5%';

export type WorkTypeOption = {
  id: WorkTypeId;
  incomeKind: IncomeInputKind;
  label: string;
  shortDesc: string;
  /** 가중치 표기 (카드 표시용, 풀어 쓴 축) */
  weightsLine: string;
  /** 한 줄 특징 */
  featureShort: string;
  icon: string;
};

export const WORK_TYPE_OPTIONS: WorkTypeOption[] = [
  {
    id: 'NINE_TO_SIX',
    incomeKind: 'SALARY',
    label: '9 to 6 직장인',
    shortDesc: '일반 주간 근무 (오전 9시~오후 6시 전후)',
    weightsLine: WEIGHTS_LINE_OFFICE,
    featureShort: '심야·주말 플레이 비중을 높여 직장인 리듬에 맞춥니다.',
    icon: 'schedule',
  },
  {
    id: 'PART_TIME',
    incomeKind: 'HOURLY',
    label: '시간제 알바',
    shortDesc: '파트타임, 아르바이트 근무자',
    weightsLine: WEIGHTS_LINE_STANDARD,
    featureShort: '불규칙 근무를 감안한 균형 산식입니다.',
    icon: 'schedule_send',
  },
  {
    id: 'STUDENT',
    incomeKind: 'NONE',
    label: '학생 (고등학생/대학생)',
    shortDesc: '고등학생, 대학생 (소득 정보 미수집)',
    weightsLine: WEIGHTS_LINE_STANDARD,
    featureShort: '학생 생활 패턴을 가정해 순수 게임 행태만 봅니다. 소득 미수집.',
    icon: 'school',
  },
  {
    id: 'FAIR_24H',
    incomeKind: 'SALARY',
    label: '교대/야간 근무',
    shortDesc: '교대 근무, 야간 근무, 비정형 근무자',
    weightsLine: WEIGHTS_LINE_STANDARD,
    featureShort: '시간 편향을 줄이고 볼륨·결과·연패·틸트재큐 중심입니다.',
    icon: 'nightlight',
  },
  {
    id: 'UNEMPLOYED',
    incomeKind: 'NONE',
    label: '백수/휴직자',
    shortDesc: '구직자, 휴직 중, 프리랜서 (소득 정보 미수집)',
    weightsLine: WEIGHTS_LINE_STANDARD,
    featureShort: '구직·휴직 등 시간 제약 없이 행태만 측정합니다. 소득 미수집.',
    icon: 'person',
  },
];

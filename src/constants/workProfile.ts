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

export type WorkTypeOption = {
  id: WorkTypeId;
  incomeKind: IncomeInputKind;
  label: string;
  shortDesc: string;
  detail: string;
  icon: string;
};

export const WORK_TYPE_OPTIONS: WorkTypeOption[] = [
  {
    id: 'NINE_TO_SIX',
    incomeKind: 'SALARY',
    label: '9 to 6 직장인',
    shortDesc: '일반 주간 근무 (오전 9시~오후 6시 전후)',
    icon: 'schedule',
    detail:
      '가중치: 볼륨 30% · 결과 20% · 심야 15% · 주말 10% · 세션 10% · 연패 10% · 틸트재큐 5%\n\n특징: 심야(KST 01-06시), 주말 플레이를 더 높게 측정하여 직장인의 생활 패턴을 반영합니다.',
  },
  {
    id: 'PART_TIME',
    incomeKind: 'HOURLY',
    label: '시간제 알바',
    shortDesc: '파트타임, 아르바이트 근무자',
    icon: 'schedule_send',
    detail:
      '가중치: 볼륨 35% · 결과 25% · 세션 15% · 연패 10% · 틸트재큐 10% · 파편화 5%\n\n특징: 불규칙한 근무 시간을 고려한 공평한 측정 방식을 적용합니다.',
  },
  {
    id: 'STUDENT',
    incomeKind: 'NONE',
    label: '학생 (고등학생/대학생)',
    shortDesc: '고등학생, 대학생 (소득 정보 미수집)',
    icon: 'school',
    detail:
      '가중치: 볼륨 35% · 결과 25% · 세션 15% · 연패 10% · 틸트재큐 10% · 파편화 5%\n\n특징: 시간대 제약 없이 순수 게임 행태만 측정합니다. 소득 정보는 수집하지 않습니다.',
  },
  {
    id: 'FAIR_24H',
    incomeKind: 'SALARY',
    label: '교대/야간 근무',
    shortDesc: '교대 근무, 야간 근무, 비정형 근무자',
    icon: 'nightlight',
    detail:
      '가중치: 볼륨 35% · 결과 25% · 세션 15% · 연패 10% · 틸트재큐 10% · 파편화 5%\n\n특징: 시간대 편향을 제거하고 순수한 게임 행태(볼륨, 결과, 연패, 틸트)만 측정합니다.',
  },
  {
    id: 'UNEMPLOYED',
    incomeKind: 'NONE',
    label: '백수/휴직자',
    shortDesc: '구직자, 휴직 중, 프리랜서 (소득 정보 미수집)',
    icon: 'person',
    detail:
      '가중치: 볼륨 35% · 결과 25% · 세션 15% · 연패 10% · 틸트재큐 10% · 파편화 5%\n\n특징: 시간 제약 없이 순수 게임 행태만 측정합니다. 소득 정보는 수집하지 않습니다.',
  },
];

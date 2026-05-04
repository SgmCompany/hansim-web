'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiError } from '@/src/lib/api/client';
import { useMe, useUpdateProfile } from '@/src/lib/api/hooks/useMe';
import { buildUpdateProfileRequest } from '@/src/lib/api/services/userService';
import {
  WORK_TYPE_LABELS,
  WORK_TYPE_OPTIONS,
  type IncomeInputKind,
  type WorkTypeId,
} from '@/src/constants/workProfile';

type Step = 1 | 2 | 3;

function profileUpdateErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const data = err.data;
    const fromBody =
      data && typeof data === 'object' && 'message' in data && typeof (data as { message: unknown }).message === 'string'
        ? String((data as { message: string }).message)
        : null;
    if (err.status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인 후 시도해 주세요.';
    }
    if (err.status === 400 || err.status === 422) {
      return fromBody ?? '입력값을 확인해 주세요.';
    }
    return fromBody ?? '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }
  const msg = err instanceof Error ? err.message : '';
  if (/Network error|Failed to fetch|fetch|Load failed|network/i.test(msg)) {
    return '서버에 연결할 수 없습니다. 네트워크와 API 주소를 확인해 주세요.';
  }
  return '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.';
}

function formatThousands(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return String(parseInt(digits, 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function parseDigits(display: string): number | null {
  const raw = display.replace(/\D/g, '');
  if (!raw) return null;
  return parseInt(raw, 10);
}

export function WorkProfileOnboarding() {
  const router = useRouter();
  const { status } = useSession();
  const { data: me, isLoading: meLoading, isError: meError } = useMe();
  const updateProfile = useUpdateProfile();

  const [step, setStep] = useState<Step>(1);
  const [selectedType, setSelectedType] = useState<WorkTypeId | null>(null);
  const [incomeKind, setIncomeKind] = useState<IncomeInputKind>('SALARY');
  const [incomeDisplay, setIncomeDisplay] = useState('');
  const [summaryIncome, setSummaryIncome] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const serverHydratedRef = useRef(false);

  const selectedOption = useMemo(
    () => WORK_TYPE_OPTIONS.find((o) => o.id === selectedType) ?? null,
    [selectedType],
  );

  const incomeStepCopy = useMemo(() => {
    if (incomeKind === 'NONE') {
      return {
        title: '소득 정보는 수집하지 않습니다',
        subtitle:
          '선택하신 유형은 소득 정보 없이 한심지수를 계산합니다. 바로 다음 단계로 진행해주세요.',
        showInput: false,
        label: '',
        suffix: '',
        placeholder: '',
        hint: '',
      };
    }
    if (incomeKind === 'HOURLY') {
      return {
        title: '시급을 알려주세요',
        subtitle:
          '시급 정보는 한심지수의 "경제적 영향도"를 계산하는 데 사용됩니다. 입력하신 정보는 암호화되어 안전하게 보관되며, 통계 목적으로만 사용됩니다.',
        showInput: true,
        label: '시급',
        suffix: '원',
        placeholder: '예: 12000',
        hint: '💡 시급은 선택사항입니다. 입력하지 않아도 한심지수는 정상적으로 계산됩니다.',
      };
    }
    return {
      title: '세전 연봉을 알려주세요',
      subtitle:
        '연봉 정보는 한심지수의 "경제적 영향도"를 계산하는 데 사용됩니다. 입력하신 정보는 암호화되어 안전하게 보관되며, 통계 목적으로만 사용됩니다.',
      showInput: true,
      label: '세전 연봉',
      suffix: '만원',
      placeholder: '예: 4500',
      hint: '💡 연봉은 선택사항입니다. 입력하지 않아도 한심지수는 정상적으로 계산됩니다.',
    };
  }, [incomeKind]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (!me || status !== 'authenticated' || serverHydratedRef.current) return;
    const wt = me.workType;
    if (wt != null && WORK_TYPE_OPTIONS.some((o) => o.id === wt)) {
      setSelectedType(wt);
    }
    serverHydratedRef.current = true;
  }, [me, status]);

  if (status === 'loading' || (status === 'authenticated' && meLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-pulse text-on-surface-variant">로딩 중...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const progressPct = (step / 3) * 100;

  const goNextFromType = () => {
    if (!selectedType || !selectedOption) return;
    setSubmitError(null);
    setIncomeKind(selectedOption.incomeKind);
    if (me?.workType === selectedType) {
      if (selectedType === 'NINE_TO_SIX' || selectedType === 'FAIR_24H') {
        const v = me.annualSalary;
        setIncomeDisplay(v != null ? formatThousands(String(v)) : '');
      } else if (selectedType === 'PART_TIME') {
        const v = me.hourlyWage;
        setIncomeDisplay(v != null ? formatThousands(String(v)) : '');
      } else {
        setIncomeDisplay('');
      }
    } else {
      setIncomeDisplay('');
    }
    setStep(2);
  };

  const goSubmit = async () => {
    if (!selectedType) return;
    setSubmitError(null);
    let income: number | null = null;
    if (incomeKind !== 'NONE' && incomeStepCopy.showInput) {
      income = parseDigits(incomeDisplay);
    }
    const body = buildUpdateProfileRequest(selectedType, income);

    try {
      await updateProfile.mutateAsync(body);
      setSummaryIncome(income);
      setStep(3);
    } catch (err) {
      setSubmitError(profileUpdateErrorMessage(err));
    }
  };

  const summaryIncomeLabel = incomeKind === 'HOURLY' ? '시급' : '세전 연봉';
  const summaryIncomeText =
    incomeKind === 'NONE'
      ? null
      : summaryIncome !== null
        ? incomeKind === 'HOURLY'
          ? `${summaryIncome.toLocaleString('ko-KR')}원`
          : `${summaryIncome.toLocaleString('ko-KR')}만원`
        : '미입력';

  return (
    <>
      {meError && (
        <p className="mb-6 rounded-2xl bg-error-container/15 px-4 py-3 text-sm font-medium text-error">
          저장된 프로필을 불러오지 못했습니다. 아래에서 다시 설정할 수 있습니다.
        </p>
      )}

      <div
        className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-surface-container"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="설정 진행률"
      >
        <div
          className="h-full rounded-full bg-gradient-to-br from-primary to-primary-dim transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {step === 1 && (
        <div className="no-line-boundary mb-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-[3rem] sm:p-12">
          <h1 className="mb-4 text-[1.75rem] font-black tracking-tight text-on-surface sm:text-[2rem]">
            어떤 근무 형태인가요?
          </h1>
          <p className="mb-10 text-base leading-relaxed text-on-surface-variant">
            한심지수는 근무 유형에 따라 다른 알고리즘으로 계산됩니다. 본인의 근무 형태와 가장 가까운 것을
            선택해주세요.
          </p>

          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            근무 유형 선택
          </div>

          <div className="mb-10 flex flex-col gap-4">
            {WORK_TYPE_OPTIONS.map((opt) => {
              const selected = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id)}
                  className={[
                    'relative w-full rounded-[2rem] border-[3px] bg-surface-container p-6 text-left transition-all sm:p-8',
                    'hover:-translate-y-1 hover:shadow-[0_8px_40px_-10px_rgba(0,106,53,0.15)]',
                    selected
                      ? 'border-primary bg-primary-container shadow-[0_8px_40px_-10px_rgba(0,106,53,0.25)]'
                      : 'border-transparent',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary',
                      selected ? 'flex' : 'hidden',
                    ].join(' ')}
                    aria-hidden
                  >
                    <span className="material-symbols-outlined text-xl">check</span>
                  </span>
                  <div
                    className={[
                      'mb-4 flex h-14 w-14 items-center justify-center rounded-3xl text-[1.75rem]',
                      selected ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface',
                    ].join(' ')}
                  >
                    <span className="material-symbols-outlined">{opt.icon}</span>
                  </div>
                  <div className="mb-2 text-xl font-extrabold text-on-surface">{opt.label}</div>
                  <div className="mb-3 text-sm text-on-surface-variant">{opt.shortDesc}</div>
                  <div
                    className={[
                      'whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-snug text-on-surface-variant',
                      selected ? 'bg-primary/10 font-semibold text-on-primary-container' : 'bg-white/50',
                    ].join(' ')}
                  >
                    {opt.detail}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row">
            <Link
              href="/account"
              className="flex flex-1 items-center justify-center rounded-full bg-surface-container px-8 py-5 text-base font-bold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              나중에 설정
            </Link>
            <button
              type="button"
              disabled={!selectedType}
              onClick={goNextFromType}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-dim px-8 py-5 text-base font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              다음
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="no-line-boundary mb-6 rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-[3rem] sm:p-12">
          <h1 className="mb-4 text-[1.75rem] font-black tracking-tight text-on-surface sm:text-[2rem]">
            {incomeStepCopy.title}
          </h1>
          <p className="mb-10 text-base leading-relaxed text-on-surface-variant">{incomeStepCopy.subtitle}</p>

          {incomeStepCopy.showInput && (
            <div className="mb-10">
              <label htmlFor="work-profile-income" className="mb-3 block text-sm font-bold text-on-surface">
                {incomeStepCopy.label}
              </label>
              <div className="relative flex items-center">
                <input
                  id="work-profile-income"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={incomeStepCopy.placeholder}
                  value={incomeDisplay}
                  onChange={(e) => setIncomeDisplay(formatThousands(e.target.value))}
                  disabled={updateProfile.isPending}
                  className="w-full rounded-full border-2 border-transparent bg-surface-container py-5 pl-6 pr-36 text-lg font-semibold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:shadow-[0_0_0_4px_rgba(107,254,156,0.3)] disabled:opacity-50"
                />
                <span className="pointer-events-none absolute right-6 text-lg font-bold text-on-surface-variant">
                  {incomeStepCopy.suffix}
                </span>
              </div>
              <p className="mt-3 pl-6 text-[0.8125rem] text-on-surface-variant">{incomeStepCopy.hint}</p>
            </div>
          )}

          {submitError && (
            <p className="mb-6 text-sm font-medium text-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                setStep(1);
              }}
              disabled={updateProfile.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-surface-container px-8 py-5 text-base font-bold text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              이전
            </button>
            <button
              type="button"
              onClick={() => void goSubmit()}
              disabled={updateProfile.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-dim px-8 py-5 text-base font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {updateProfile.isPending ? '저장 중...' : '설정 완료'}
              {!updateProfile.isPending && <span className="material-symbols-outlined text-xl">check</span>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedType && (
        <div className="no-line-boundary rounded-[2rem] bg-surface-container-lowest p-6 text-center shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-[3rem] sm:p-12">
          <div className="animate-success-pop mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[3rem] bg-gradient-to-br from-primary to-primary-dim text-on-primary">
            <span className="material-symbols-outlined text-5xl">verified</span>
          </div>
          <h2 className="mb-3 text-[1.75rem] font-black text-on-surface">프로필 설정 완료!</h2>
          <p className="mb-8 text-base leading-relaxed text-on-surface-variant">
            이제 맞춤형 한심지수를 확인할 수 있습니다.
          </p>

          <div className="mb-8 rounded-3xl bg-surface-container p-6 text-left">
            <div className="flex items-center justify-between border-b border-outline-variant/15 py-3 first:pt-0">
              <span className="text-sm font-semibold text-on-surface-variant">근무 유형</span>
              <span className="text-base font-extrabold text-on-surface">
                {WORK_TYPE_LABELS[selectedType]}
              </span>
            </div>
            {incomeKind !== 'NONE' && (
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm font-semibold text-on-surface-variant">{summaryIncomeLabel}</span>
                <span className="text-base font-extrabold text-on-surface">{summaryIncomeText}</span>
              </div>
            )}
          </div>

          <Link
            href="/account"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-dim px-8 py-5 text-base font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] sm:w-auto sm:min-w-[12rem]"
          >
            계정 설정으로 돌아가기
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
        </div>
      )}
    </>
  );
}

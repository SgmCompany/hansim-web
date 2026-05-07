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
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
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
          '시급 정보는 한심지수의 "경제적 영향도"를 계산하는 데 사용됩니다. 통계 목적으로 사용됩니다.',
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
        '연봉 정보는 한심지수의 "경제적 영향도"를 계산하는 데 사용됩니다. 통계 목적으로 사용됩니다.',
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
        const v = me.salaryAmount;
        setIncomeDisplay(v != null ? formatThousands(String(Math.round(v / 10000))) : '');
      } else if (selectedType === 'PART_TIME') {
        const v = me.salaryAmount;
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
          : `${(summaryIncome * 10000).toLocaleString('ko-KR')}원`
        : '미입력';

  return (
    <>
      {meError && (
        <p className="mb-5 rounded-lg bg-error-container/15 px-3 py-2.5 text-sm font-medium text-error">
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
        <div className="no-line-boundary mb-6 rounded-xl bg-surface-container-lowest p-5 shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-7">
          <h1 className="mb-3 text-xl font-black tracking-tight text-on-surface sm:text-2xl">
            어떤 근무 형태인가요?
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-[0.9375rem]">
            한심지수는 근무 유형에 따라 다른 알고리즘으로 계산됩니다. 본인의 근무 형태와 가장 가까운
            것을 선택해주세요.
          </p>

          <div className="mb-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            근무 유형 선택
          </div>

          <div className="mb-8 flex flex-col gap-3">
            {WORK_TYPE_OPTIONS.map((opt) => {
              const selected = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id)}
                  className={[
                    'relative w-full rounded-sm border-2 bg-surface-container p-4 text-left transition-all sm:p-5',
                    'hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10',
                    selected
                      ? 'border-primary bg-primary-container shadow-md shadow-primary/15'
                      : 'border-transparent',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary',
                      selected ? 'flex' : 'hidden',
                    ].join(' ')}
                    aria-hidden
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                  </span>
                  <div className="flex gap-3">
                    <div
                      className={[
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl',
                        selected
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface',
                      ].join(' ')}
                    >
                      <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1 pr-8">
                      <div className="text-base font-extrabold leading-tight text-on-surface">
                        {opt.label}
                      </div>
                      <div className="mt-1 text-xs leading-snug text-on-surface-variant sm:text-[13px]">
                        {opt.shortDesc}
                      </div>
                      <dl
                        className={[
                          'mt-3 space-y-2 rounded-lg border px-3 py-2 text-[11px] leading-snug sm:text-xs',
                          selected
                            ? 'border-primary/20 bg-primary/10 text-on-primary-container'
                            : 'border-outline-variant/20 bg-surface-container-lowest/80 text-on-surface-variant',
                        ].join(' ')}
                      >
                        <div className="flex gap-2">
                          <dt className="w-10 shrink-0 font-semibold text-on-surface-variant">
                            가중치
                          </dt>
                          <dd className="min-w-0 font-medium leading-snug text-on-surface">
                            {opt.weightsLine}
                          </dd>
                        </div>
                        <div className="flex gap-2 border-t border-outline-variant/15 pt-2">
                          <dt className="w-10 shrink-0 font-semibold text-on-surface-variant">
                            특징
                          </dt>
                          <dd className="min-w-0">{opt.featureShort}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <Link
              href="/account"
              className="flex flex-1 items-center justify-center rounded-xl bg-surface-container px-6 py-3.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high sm:text-base"
            >
              나중에 설정
            </Link>
            <button
              type="button"
              disabled={!selectedType}
              onClick={goNextFromType}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-6 py-3.5 text-sm font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:text-base"
            >
              다음
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="no-line-boundary mb-6 rounded-xl bg-surface-container-lowest p-5 shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-7">
          <h1 className="mb-3 text-xl font-black tracking-tight text-on-surface sm:text-2xl">
            {incomeStepCopy.title}
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-[0.9375rem]">
            {incomeStepCopy.subtitle}
          </p>

          {incomeStepCopy.showInput && (
            <div className="mb-8">
              <label
                htmlFor="work-profile-income"
                className="mb-2 block text-sm font-bold text-on-surface"
              >
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
                  className="w-full rounded-xl border-2 border-transparent bg-surface-container py-3.5 pl-4 pr-28 text-base font-semibold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(107,254,156,0.25)] disabled:opacity-50 sm:py-4 sm:pl-5 sm:pr-32 sm:text-lg"
                />
                <span className="pointer-events-none absolute right-4 text-base font-bold text-on-surface-variant sm:right-5 sm:text-lg">
                  {incomeStepCopy.suffix}
                </span>
              </div>
              <p className="mt-2 pl-1 text-xs text-on-surface-variant sm:text-[0.8125rem]">
                {incomeStepCopy.hint}
              </p>
            </div>
          )}

          {submitError && (
            <p className="mb-5 text-sm font-medium text-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                setStep(1);
              }}
              disabled={updateProfile.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container px-6 py-3.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-50 sm:text-base"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              이전
            </button>
            <button
              type="button"
              onClick={() => void goSubmit()}
              disabled={updateProfile.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-6 py-3.5 text-sm font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:text-base"
            >
              {updateProfile.isPending ? '저장 중...' : '설정 완료'}
              {!updateProfile.isPending && (
                <span className="material-symbols-outlined text-lg">check</span>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedType && (
        <div className="no-line-boundary rounded-xl bg-surface-container-lowest p-5 text-center shadow-[0_4px_60px_-15px_rgba(0,0,0,0.05)] sm:rounded-2xl sm:p-7">
          <div className="animate-success-pop mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dim text-on-primary">
            <span className="material-symbols-outlined text-4xl">verified</span>
          </div>
          <h2 className="mb-2 text-xl font-black text-on-surface sm:text-2xl">프로필 설정 완료!</h2>
          <p className="mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-[0.9375rem]">
            이제 맞춤형 한심지수를 확인할 수 있습니다.
          </p>

          <div className="mb-6 rounded-xl bg-surface-container p-4 text-left sm:p-5">
            <div className="flex items-center justify-between border-b border-outline-variant/15 py-3 first:pt-0">
              <span className="text-sm font-semibold text-on-surface-variant">근무 유형</span>
              <span className="text-base font-extrabold text-on-surface">
                {WORK_TYPE_LABELS[selectedType]}
              </span>
            </div>
            {incomeKind !== 'NONE' && (
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm font-semibold text-on-surface-variant">
                  {summaryIncomeLabel}
                </span>
                <span className="text-base font-extrabold text-on-surface">
                  {summaryIncomeText}
                </span>
              </div>
            )}
          </div>

          <Link
            href="/account"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-6 py-3.5 text-sm font-bold text-on-primary shadow-[0_4px_16px_-4px_rgba(0,106,53,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_-4px_rgba(0,106,53,0.45)] active:scale-[0.98] sm:w-auto sm:min-w-48 sm:text-base"
          >
            계정 설정으로 돌아가기
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      )}
    </>
  );
}

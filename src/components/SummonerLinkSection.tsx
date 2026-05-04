'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ApiError } from '@/src/lib/api/client';
import { useLinkSummoner, useMe, useUnlinkSummoner } from '@/src/lib/api/hooks/useMe';
import { useLatestVersion } from '@/src/lib/ddragon/hooks/useVersion';
import { DEFAULT_RIOT_TAGLINE, parseRiotIdForApi, riotIdFromParts } from '@/src/utils/riotId';

function linkErrorMessage(status: number, data?: unknown): string {
  const fromBody =
    data && typeof data === 'object' && 'message' in data && typeof (data as { message: unknown }).message === 'string'
      ? String((data as { message: string }).message)
      : null;

  if (status === 404) {
    return '존재하지 않는 소환사입니다. 이름과 태그라인을 다시 확인해주세요.';
  }
  if (status === 409) {
    return '이미 다른 계정에 연동된 소환사입니다.';
  }
  if (status === 400 || status === 422) {
    return fromBody ?? '입력값을 확인해 주세요. (게임 이름·태그라인)';
  }
  if (status === 401) {
    return '로그인이 필요합니다. 다시 로그인 후 시도해 주세요.';
  }
  return fromBody ?? '소환사 연동에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

export function SummonerLinkSection() {
  const { data: session, status: sessionStatus } = useSession();
  const { data: me, isLoading, isError, error, refetch, isFetching } = useMe();
  const linkMutation = useLinkSummoner();
  const unlinkMutation = useUnlinkSummoner();
  const { data: ddragonVersion } = useLatestVersion();

  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState(DEFAULT_RIOT_TAGLINE);
  /** 한 줄 입력 (닉#태그) — 연동 폼 보조 */
  const [combinedInput, setCombinedInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  const linked = !!me?.summoner;
  const busy = linkMutation.isPending || unlinkMutation.isPending;

  useEffect(() => {
    if (!combinedInput.trim()) return;
    const parsed = parseRiotIdForApi(combinedInput);
    if (parsed) {
      setGameName(parsed.gameName);
      setTagLine(parsed.tagLine);
    }
  }, [combinedInput]);

  useEffect(() => {
    if (linked && me?.summoner && isChanging) {
      setGameName(me.summoner.gameName);
      setTagLine(me.summoner.tagLine);
      setCombinedInput('');
      setFormError(null);
    }
  }, [linked, me?.summoner, isChanging]);

  useEffect(() => {
    if (!showUnlinkModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUnlinkModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showUnlinkModal]);

  const profileIconSrc = ddragonVersion
    ? `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/29.png`
    : null;

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const body = riotIdFromParts(gameName, tagLine);
    if (!body) {
      setFormError('소환사 이름을 입력해주세요.');
      return;
    }

    try {
      await linkMutation.mutateAsync(body);
      setIsChanging(false);
      setCombinedInput('');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(linkErrorMessage(err.status, err.data));
      } else {
        const msg = err instanceof Error ? err.message : '';
        const looksLikeNetwork = /Network error|Failed to fetch|fetch|Load failed|network/i.test(msg);
        setFormError(
          looksLikeNetwork
            ? '서버에 연결할 수 없습니다. .env의 NEXT_PUBLIC_API_BASE_URL(로컬 기본은 http://localhost:8080)과 백엔드 실행 여부를 확인해 주세요.'
            : linkErrorMessage(0),
        );
      }
    }
  };

  const handleUnlink = async () => {
    try {
      await unlinkMutation.mutateAsync();
      setShowUnlinkModal(false);
      setIsChanging(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setFormError('연동된 소환사가 없습니다.');
      } else {
        setFormError('연동 해제에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      setShowUnlinkModal(false);
    }
  };

  const startChange = () => {
    setFormError(null);
    setIsChanging(true);
    if (me?.summoner) {
      setGameName(me.summoner.gameName);
      setTagLine(me.summoner.tagLine);
    }
    setCombinedInput('');
  };

  const cancelChange = () => {
    setIsChanging(false);
    setFormError(null);
    setCombinedInput('');
    if (me?.summoner) {
      setGameName(me.summoner.gameName);
      setTagLine(me.summoner.tagLine);
    } else {
      setGameName('');
      setTagLine(DEFAULT_RIOT_TAGLINE);
    }
  };

  const tokenMissing = sessionStatus === 'authenticated' && !session?.accessToken;

  if (isLoading && !me) {
    return (
      <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary mb-6">
        <div className="h-8 w-48 bg-surface-container rounded-full animate-pulse mb-6" />
        <div className="h-32 rounded-[2rem] bg-primary-container/30 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    const unauthorized = error instanceof ApiError && error.status === 401;
    return (
      <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary mb-6">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4">소환사 연동</h2>
        <p className="text-on-surface-variant mb-4">
          {unauthorized
            ? '로그인 세션이 만료되었거나 API 토큰이 없습니다. 다시 로그인한 뒤 소환사 연동을 진행해 주세요.'
            : `프로필 정보를 불러오지 못했습니다.${error instanceof Error ? ` (${error.message})` : ''}`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {unauthorized && (
            <Link
              href="/auth/signin"
              className="inline-flex justify-center px-6 py-3 rounded-full font-bold bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-md text-center"
            >
              로그인 하기
            </Link>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="px-6 py-3 bg-surface-container-high hover:bg-surface-container rounded-full font-bold transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] no-line-boundary shadow-[0_1px_3px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 mb-6">
        {tokenMissing && (
          <div
            className="mb-6 rounded-3xl border border-outline/20 bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant"
            role="status"
          >
            <p className="font-semibold text-on-surface mb-1">API 토큰을 세션에서 찾지 못했습니다</p>
            <p>
              과거에 로그인만 된 상태로 남아 있을 수 있습니다.{' '}
              <Link href="/auth/signin" className="font-bold text-primary underline underline-offset-2">
                다시 로그인
              </Link>
              하거나 상단에서 로그아웃 후 로그인하면 소환사 연동이 정상 동작합니다.
            </p>
          </div>
        )}
        {linked && !isChanging ? (
          <>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">연동된 소환사</h2>
            {formError && (
              <div
                className="flex items-start gap-2 text-sm font-semibold text-error px-4 py-3 rounded-3xl bg-error-container/10 mb-6"
                role="alert"
              >
                <span className="material-symbols-outlined shrink-0 text-lg">error</span>
                <span>{formError}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-primary-container to-[#a8ffcf] mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1 w-full text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-20 h-20 sm:w-[5.5rem] sm:h-[5.5rem] rounded-3xl bg-surface-container-lowest flex items-center justify-center shadow-[0_4px_16px_rgba(0,106,53,0.2)] shrink-0 overflow-hidden">
                  {profileIconSrc ? (
                    <img
                      src={profileIconSrc}
                      alt=""
                      className="w-[4.5rem] h-[4.5rem] sm:w-[4.75rem] sm:h-[4.75rem] rounded-[1.25rem]"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-primary" aria-hidden>
                      person
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-black tracking-tight text-on-primary-container break-all">
                    {me?.summoner?.gameName}{' '}
                    <span className="text-on-primary-container/90 font-normal">#{me?.summoner?.tagLine}</span>
                  </p>
                  <p className="text-sm font-semibold text-on-primary-container/75 mt-1">
                    Riot 계정과 연동되었습니다
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={startChange}
                  disabled={busy || isFetching}
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3.5 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-full font-bold transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">sync</span>
                  소환사 변경
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setShowUnlinkModal(true);
                  }}
                  disabled={busy || isFetching}
                  className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3.5 bg-error-container text-error rounded-full font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">link_off</span>
                  연동 해제
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">
              {isChanging ? '소환사 변경' : '소환사 연동'}
            </h2>

            {!isChanging && (
              <div className="rounded-[2rem] p-8 sm:p-10 text-center mb-8 bg-gradient-to-br from-primary-container to-[#a8ffcf]">
                <div className="text-5xl sm:text-6xl mb-4" aria-hidden>
                  🎮
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-primary-container mb-3 leading-snug">
                  아직 소환사를 연동하지 않으셨네요!
                  <br />
                  한심지수를 확인해볼까요?
                </h3>
                <p className="text-on-primary-container/85 text-sm sm:text-base max-w-xl mx-auto">
                  소환사를 연동하면 한 번의 클릭으로 내 전적을 확인할 수 있어요
                </p>
              </div>
            )}

            <form onSubmit={handleLinkSubmit} className="space-y-6">
              <div>
                <label htmlFor="summoner-combined" className="block text-sm font-bold text-on-surface mb-3">
                  소환사명 + 태그라인 (선택)
                </label>
                <input
                  id="summoner-combined"
                  type="text"
                  autoComplete="off"
                  disabled={busy}
                  placeholder="예: 페이커#KR1"
                  value={combinedInput}
                  onChange={(e) => setCombinedInput(e.target.value)}
                  className="w-full px-6 py-4 rounded-full bg-surface-container text-on-surface font-medium placeholder:text-on-surface-variant/60 border-0 outline-none focus:ring-4 focus:ring-primary-container focus:bg-surface-container-lowest transition-all"
                />
                <p className="mt-2 text-sm text-on-surface-variant">
                  한 줄로 입력하면 아래 칸이 채워집니다. 닉만 쓰면 자동으로 #{DEFAULT_RIOT_TAGLINE}이 붙습니다.
                </p>
              </div>

              <div>
                <span className="block text-sm font-bold text-on-surface mb-3">게임 이름 · 태그라인</span>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  id="summoner-game-name"
                  type="text"
                  autoComplete="off"
                  disabled={busy}
                  placeholder="예: 페이커"
                  value={gameName}
                  onChange={(e) => {
                    setGameName(e.target.value);
                    setCombinedInput('');
                  }}
                    className="flex-[2] min-w-0 px-6 py-4 rounded-full bg-surface-container text-on-surface font-medium placeholder:text-on-surface-variant/60 border-0 outline-none focus:ring-4 focus:ring-primary-container focus:bg-surface-container-lowest transition-all"
                  />
                  <span
                    className="hidden sm:flex text-2xl font-bold text-on-surface-variant shrink-0 select-none"
                    aria-hidden
                  >
                    #
                  </span>
                  <input
                    id="summoner-tag"
                    type="text"
                    autoComplete="off"
                    disabled={busy}
                    placeholder={DEFAULT_RIOT_TAGLINE}
                    value={tagLine}
                    onChange={(e) => {
                      setTagLine(e.target.value);
                      setCombinedInput('');
                    }}
                    className="flex-1 min-w-0 px-6 py-4 rounded-full bg-surface-container text-on-surface font-medium placeholder:text-on-surface-variant/60 border-0 outline-none focus:ring-4 focus:ring-primary-container focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">
                  태그라인을 비우면 기본값 #{DEFAULT_RIOT_TAGLINE}이 적용됩니다
                </p>
              </div>

              {formError && (
                <div
                  className="flex items-start gap-2 text-sm font-semibold text-error px-4 py-3 rounded-3xl bg-error-container/10"
                  role="alert"
                >
                  <span className="material-symbols-outlined shrink-0 text-lg">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 min-h-[3.25rem] px-8 py-4 rounded-full font-bold text-on-primary bg-gradient-to-br from-primary to-primary-dim shadow-[0_4px_12px_rgba(0,106,53,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined">link</span>
                  {isChanging ? '변경하기' : '소환사 연동하기'}
                </button>
                {isChanging && (
                  <button
                    type="button"
                    onClick={cancelChange}
                    disabled={busy}
                    className="inline-flex items-center justify-center min-h-[3.25rem] px-8 py-4 rounded-full font-bold bg-surface-container-high hover:bg-surface-container text-on-surface transition-colors disabled:opacity-50"
                  >
                    취소
                  </button>
                )}
              </div>

              {linkMutation.isPending && (
                <div className="inline-flex items-center gap-3 px-5 py-4 rounded-[2rem] bg-primary-container/20">
                  <span
                    className="size-5 rounded-full border-[3px] border-primary-container border-t-primary animate-spin shrink-0"
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-primary">소환사 정보를 확인하고 있습니다...</span>
                </div>
              )}
            </form>
          </>
        )}
      </div>

      {showUnlinkModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/60 backdrop-blur-md"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUnlinkModal(false);
          }}
        >
          <div
            className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-md w-full shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlink-modal-title"
          >
            <div className="text-center text-error mb-4">
              <span className="material-symbols-outlined text-[3.5rem]" aria-hidden>
                warning
              </span>
            </div>
            <h3 id="unlink-modal-title" className="text-xl sm:text-2xl font-black text-center text-on-surface mb-3">
              정말 연동을 해제하시겠습니까?
            </h3>
            <p className="text-sm sm:text-[15px] text-on-surface-variant text-center leading-relaxed mb-8">
              연동을 해제하면 &apos;내 한심지수&apos; 바로가기 기능을 사용할 수 없게 됩니다. 언제든 다시 연동할 수
              있습니다.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowUnlinkModal(false)}
                disabled={unlinkMutation.isPending}
                className="flex-1 min-h-11 px-6 py-3.5 rounded-full font-bold bg-surface-container-high hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleUnlink}
                disabled={unlinkMutation.isPending}
                className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold bg-error-container text-error hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-xl">link_off</span>
                {unlinkMutation.isPending ? '처리 중...' : '해제하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

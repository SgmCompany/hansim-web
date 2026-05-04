/**
 * API 클라이언트
 * 백엔드 API와 통신하기 위한 기본 설정
 */

import { HANSIM_ACCESS_TOKEN_KEY } from '@/src/lib/auth/accessTokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
  console.warn(
    'NEXT_PUBLIC_API_BASE_URL is not defined, using http://localhost:8080 (openapi servers 기본값과 동일)',
  );
}

/** openapi/openapi.json servers 기본값과 맞춤 (sync-api-spec·로컬 백엔드는 8080) */
const BASE_URL = API_BASE_URL || 'http://localhost:8080';

async function resolveClientBearerToken(): Promise<string | undefined> {
  const { getSession } = await import('next-auth/react');
  const session = await getSession();
  if (session?.accessToken) return session.accessToken;
  try {
    return localStorage.getItem(HANSIM_ACCESS_TOKEN_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>;
  skipAuth?: boolean;
}

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function addRequestInterceptor(interceptor: RequestInterceptor) {
  requestInterceptors.push(interceptor);
}

export function addResponseInterceptor(interceptor: ResponseInterceptor) {
  responseInterceptors.push(interceptor);
}

/**
 * API 요청 함수
 */
export async function apiRequest<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
  const { params, skipAuth = false, ...fetchConfig } = config;

  // URL 생성
  const url = new URL(endpoint, BASE_URL);

  // Query parameters 추가
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // 기본 헤더 설정
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchConfig.headers,
  };

  // 인증 토큰 추가 (클라이언트 사이드에서만) — 세션 + localStorage 폴백
  if (typeof window !== 'undefined' && !skipAuth) {
    const bearer = await resolveClientBearerToken();
    if (bearer) {
      headers = {
        ...headers,
        Authorization: `Bearer ${bearer}`,
      };
    }
  }

  // Request 인터셉터 실행
  let requestConfig: RequestInit = {
    ...fetchConfig,
    headers,
  };

  for (const interceptor of requestInterceptors) {
    requestConfig = await interceptor(requestConfig);
  }

  try {
    let response = await fetch(url.toString(), requestConfig);

    // Response 인터셉터 실행
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    // 에러 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(response.status, response.statusText, errorData);
    }

    // 204 No Content 처리
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // 상세한 에러 로그
    console.error('API Request Failed:', {
      url: url.toString(),
      method: requestConfig.method,
      error: error instanceof Error ? error.message : error,
    });

    throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * GET 요청
 */
export function apiGet<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>(endpoint, { ...config, method: 'GET' });
}

/**
 * POST 요청
 */
export function apiPost<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 */
export function apiPut<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH 요청
 */
export function apiPatch<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...config,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 */
export function apiDelete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
  return apiRequest<T>(endpoint, { ...config, method: 'DELETE' });
}

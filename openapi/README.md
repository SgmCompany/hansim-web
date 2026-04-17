# OpenAPI 스펙 자동화

## 사용 방법

### 1. 백엔드에서 스펙 생성 (hansim-api)

```bash
cd ../hansim-api
./gradlew generateOpenApiDocs
```

이 명령어가 자동으로:
1. Spring Boot 애플리케이션 실행
2. `http://localhost:8080/v3/api-docs` 호출
3. `hansim-web/openapi/openapi.json` 파일 생성

### 2. 프론트엔드에서 타입 생성 (hansim-web)

```bash
cd ../hansim-web
npm run generate:api
```

이 명령어가:
- `openapi/openapi.json` → `src/types/api.generated.ts` 변환
- TypeScript 타입 자동 생성

### 3. 한 번에 실행 (백엔드 서버가 실행 중일 때)

```bash
npm run sync:api
```

이 명령어가:
1. 백엔드에서 최신 스펙 다운로드
2. TypeScript 타입 자동 생성

## 생성된 타입 사용 예제

```typescript
import type { paths } from '@/src/types/api.generated';

// API 응답 타입
type AuthResponse = paths['/api/v1/auth/google']['post']['responses']['200']['content']['application/json'];

// API 요청 타입
type AuthRequest = paths['/api/v1/auth/google']['post']['requestBody']['content']['application/json'];

// 사용
const response = await fetch('/api/v1/auth/google', {
  method: 'POST',
  body: JSON.stringify({
    googleToken: 'eyJ...'
  } satisfies AuthRequest)
});

const data: AuthResponse = await response.json();
```

## 워크플로우

### 백엔드 API 변경 시

1. 백엔드 코드 수정
2. `./gradlew generateOpenApiDocs` 실행
3. 프론트엔드에서 `npm run generate:api` 실행
4. 타입 에러 확인 → 프론트엔드 코드 수정

### 개발 중

백엔드 서버가 실행 중이면:

```bash
npm run sync:api
```

한 번에 최신 스펙 동기화!

## 파일 위치

```
hansim-web/
├── openapi/
│   ├── openapi.json          # 백엔드에서 생성 (git 커밋 O)
│   └── README.md             # 이 파일
└── src/types/
    └── api.generated.ts      # 자동 생성 (git 커밋 X)
```

## .gitignore 설정

- `openapi/openapi.json` - **커밋 O** (팀원이 바로 타입 생성 가능)
- `src/types/api.generated.ts` - **커밋 X** (자동 생성 파일)

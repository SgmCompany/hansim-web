# 한심지수 (Hansim-Web)

> 당신의 협곡 실력을 정밀 분석합니다.

League of Legends 전적 분석 서비스 - "The Cheerful Engineer" 디자인 시스템 기반

## 프로젝트 개요

한심지수는 리그 오브 레전드 플레이어의 전적을 분석하고 "한심지수"를 산출하는 웹 애플리케이션입니다.

### 주요 기능

- 🔍 **소환사 검색**: 단일/멀티 소환사 검색
- 📊 **통계 대시보드**: KDA, CS, 시야 점수 등
- 🏆 **실시간 리더보드**: 한심지수 기준 랭킹
- 📅 **기간 필터**: 최대 30일 범위 선택

## 기술 스택

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: @tanstack/react-query

### Design System
- **Philosophy**: "The Cheerful Engineer"
- **Font**: Manrope (Google Fonts)
- **Icons**: Material Symbols Outlined
- **Color Scheme**: Light-Mode First

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
hansim-web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   └── summoner/[name]/     # 소환사 상세
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LeaderboardSection.tsx
│   │   ├── SummonerProfile.tsx
│   │   ├── StatsGrid.tsx
│   │   └── Footer.tsx
│   ├── styles/              # 디자인 시스템 CSS
│   │   └── design-system.css
│   ├── types/               # TypeScript 타입
│   └── utils/               # 유틸리티 함수
├── stitch/                  # 디자인 시안 (HTML)
│   ├── DESIGN.md
│   ├── home.html
│   ├── detail-single.html
│   └── detail-multisearch.html
├── docs/                    # 프로젝트 문서
│   ├── DESIGN_SYSTEM.md
│   ├── COLOR_REFERENCE.md
│   ├── EXAMPLES.md
│   └── VISUAL_COMPARISON.md
├── .cursor/
│   └── rules/               # Cursor AI Rules
│       └── hansim-design.mdc  # 디자인 시스템 규칙
└── tailwind.config.ts       # Tailwind 설정
```

## 디자인 시스템

### 핵심 원칙

1. **No-Line Rule**: 1px 테두리 금지, 배경색 변화로 경계 표현
2. **Extreme Roundness**: 최소 16px, 권장 32px+ border-radius
3. **Soft Engineering**: 정확한 데이터 + 부드러운 UI
4. **Light-Mode First**: 밝고 친근한 사용자 경험

### 색상

- **Primary**: `#006A35` (Logic Green)
- **Primary Container**: `#6BFE9C` (Highlight Glow)
- **Surface**: `#F5F6F7` (Global background)
- **Surface Container Lowest**: `#FFFFFF` (Cards)

### 타이포그래피

- **Font**: Manrope (400, 500, 600, 700, 800)
- **Scale**: Display → Headline → Title → Body → Label
- **한글 최적화**: line-height 1.6+

## 문서

### 디자인
- [DESIGN.md](./stitch/DESIGN.md) - 원본 디자인 철학
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - 구현 가이드
- [COLOR_REFERENCE.md](./docs/COLOR_REFERENCE.md) - 색상 토큰
- [EXAMPLES.md](./docs/EXAMPLES.md) - 컴포넌트 예제
- [VISUAL_COMPARISON.md](./docs/VISUAL_COMPARISON.md) - Before/After 비교

### 개발
- [MIGRATION_COMPLETE.md](./docs/MIGRATION_COMPLETE.md) - HTML→React 마이그레이션
- [STITCH_ALIGNMENT.md](./docs/STITCH_ALIGNMENT.md) - 디자인 정렬 확인
- [CHANGELOG_DESIGN.md](./docs/CHANGELOG_DESIGN.md) - 변경 이력

### Cursor Rules
- [.cursor/rules/hansim-design.mdc](./.cursor/rules/hansim-design.mdc) - 디자인 시스템 규칙 (`.tsx/.jsx/.css` 파일 작업 시 자동 적용)

## API 구조 (예정)

### 집계 요약
```
GET /api/v1/hansim/summary
Query: period (optional)
Response: { periodStr, players[] }
```

### 소환사 검색
```
GET /api/v1/hansim/summoner/{name}
Response: { summoner, stats }
```

자세한 내용: [API 문서](./docs/API.md) (예정)

## 환경 변수

```env
NEXT_PUBLIC_LOGO_URL=https://example.com/logo.png
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## 스크립트

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버
npm run lint     # ESLint 실행
```

## 브라우저 지원

- Chrome/Edge: 최신 2버전
- Safari: 최신 2버전
- Firefox: 최신 2버전
- Mobile Safari: iOS 14+

## 기여 가이드

### 디자인 시스템 준수

새 컴포넌트 작성 시:
1. `.cursor/rules/hansim-design.mdc` 참조 (React/CSS 파일 작업 시 자동 적용)
2. `docs/EXAMPLES.md`에서 유사한 패턴 찾기
3. No-Line Rule, Extreme Roundness 준수

### 코드 스타일

- TypeScript strict mode
- ESLint + Prettier
- Tailwind 클래스 사용 (인라인 스타일 최소화)

## 라이선스

© 2024 SGM Company. All rights reserved.

## 문의

- **데이터 출처**: Riot Games API
- **프로젝트**: SGM Company
- **디자인**: Stitch AI

---

**Built with** ❤️ **and** ⚡ **by SGM Company**

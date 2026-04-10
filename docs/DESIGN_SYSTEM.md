# Design System: The Cheerful Engineer

## 개요

이 프로젝트는 **"The Cheerful Engineer"** 디자인 철학을 따릅니다. 데이터 중심의 정확성과 친근한 사용자 경험을 결합한 Light-Mode First 디자인 시스템입니다.

## 핵심 원칙

### 1. Soft Engineering
- 데이터는 정확하게, UI는 부드럽게
- 극단적인 둥근 모서리 (32px+)
- 촉각적이고 친근한 인터페이스

### 2. No-Line Rule
- **1px 테두리 금지**: 전통적인 border 대신 배경색 변화로 경계 표현
- Surface 계층 구조를 통한 시각적 분리
- "Ghost Border" (15% 투명도)만 예외적으로 허용

### 3. Light-Mode First
- 밝고 친근한 경험 우선
- 다크모드는 지원하지 않음
- 긴 게임 세션에도 눈의 피로를 최소화

## 색상 시스템

### Primary Colors
```css
--primary: #006A35          /* Logic Green - 핵심 액션 */
--primary-dim: #005C2D      /* 그라디언트용 어두운 녹색 */
--primary-container: #6BFE9C /* Highlight Glow - 강조 배경 */
```

### Surface Architecture
```css
--surface: #F5F6F7                    /* Level 0: 전역 배경 */
--surface-container-low: #EFF1F2      /* Level 1: 큰 영역/사이드바 */
--surface-container-lowest: #FFFFFF   /* Level 2: 주요 카드 */
--surface-container-highest: #DDE0E1  /* Level 3: 팝오버 */
```

### Text & Semantic
```css
--on-surface: #2C2F30           /* 주요 텍스트 (순수 검정 금지) */
--on-surface-variant: #5F6366   /* 보조 텍스트 */
--error: #BA1A1A                /* 에러 상태 */
--success: #006A35              /* 성공 상태 */
```

## 타이포그래피

### Font Family
- **Manrope**: 기하학적 명료함과 현대적 둥근 느낌
- 한글 최적화: line-height 1.7 이상

### Scale
```css
Display (lg/md/sm)  → 고임팩트 통계 (KDA, 승률)
Headline (lg/md/sm) → 섹션 제목
Title (lg/md/sm)    → 카드 헤더 (Workhorse)
Body (lg/md/sm)     → 데이터 설명
Label (lg/md/sm)    → 메타데이터 (대문자/넓은 자간)
```

### Hierarchy Rule
같은 카테고리의 폰트 크기를 나란히 배치 금지. 대비가 명확성의 핵심.

## 컴포넌트

### Buttons
- **형태**: `rounded-full` (9999px) - 완전한 pill 형태
- **Primary**: 135도 그라디언트 (primary → primary-dim)
- **Inner Glow**: 상단 10% 흰색 투명도로 3D 효과

### Cards
- **Border Radius**: 48px (`--radius-xl`)
- **Separation**: 수직 공백 (32px/48px)으로 구분, 구분선 금지
- **Hover**: 살짝 들어올리기 (translateY -4px)

### Filter Chips
- **Default**: `surface-container-high`
- **Active**: `primary-container` 배경 + `primary` 텍스트
- **Transition**: 부드러운 0.2s ease

### Date Picker
- **Header**: Primary 그라디언트
- **Selected**: Primary 배경
- **Range**: Primary-container로 시각화
- **Today Indicator**: 작은 점으로 표시

## Spacing System

4px 그리드 시스템:
```css
--space-xs: 8px
--space-sm: 16px
--space-md: 24px
--space-lg: 32px
--space-xl: 48px
--space-2xl: 64px
```

## Elevation

### Tonal Layering
구조적 그림자 대신 톤 레이어링 사용:
- Static Cards: 그림자 없음, surface 중첩으로 "soft lift"
- Floating Elements: `--shadow-ambient` (6% 투명도, 40px blur)

### Glassmorphism
- Fixed Navigation: 24px backdrop-blur
- Primary 색상이 부드럽게 비치도록

## Do's and Don'ts

### ✅ Do
- 극단적인 여백 사용 (데이터가 숨 쉴 공간 필요)
- 비대칭 레이아웃으로 Hero 섹션 구성
- 한글 텍스트는 최소 line-height 1.6x

### ❌ Don't
- 순수 검정 (#000000) 사용 금지 → `--on-surface` 사용
- 16px 미만의 border-radius 사용 금지
- League of Legends 다크모드 미학 사용 금지

## 파일 구조

```
src/styles/
├── design-system.css      # 메인 디자인 시스템
└── datepicker-custom.css  # DatePicker 테마

app/
├── layout.tsx             # Manrope 폰트 로드
└── globals.css            # Tailwind 통합
```

## 사용 예시

### 기본 카드
```tsx
<div className="card">
  <div className="name">소환사명</div>
  <div className="section">
    <div className="label">솔로랭크</div>
    <div className="meta">10게임 · 6승 4패</div>
    <div className="row">
      <span className="pill">한심지수: 42</span>
      <span className="pill">KDA: 3.2</span>
    </div>
  </div>
</div>
```

### Primary 버튼
```tsx
<button className="input-group button">
  검색
</button>
```

## 반응형

- Desktop: 1200px max-width
- Tablet: 768px 이하 - 단일 컬럼
- Mobile: 유연한 flex 레이아웃

## 접근성

- Reduced Motion 지원
- Focus States: Primary 색상 outline
- ARIA Labels: 모든 인터랙티브 요소
- 한글 가독성 최적화

## 브라우저 지원

- Chrome/Edge: 최신 2버전
- Safari: 최신 2버전
- Firefox: 최신 2버전
- Mobile Safari: iOS 14+

## 참고

디자인 철학 상세: `stitch/DESIGN.md`

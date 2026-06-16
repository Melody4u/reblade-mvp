# 《Re:Blade》 MVP 구현 계획서

> **목표:** 캐릭터 디자인 초안 없이도 플레이 가능한 웹/PWA MVP를 먼저 출시한다. 캐릭터 이미지는 placeholder 도트로 두고, 후추님이 디자인 초안을 주면 교체한다.

## 1. 기술 스택

- React + TypeScript + Vite
- Vitest: 게임 로직 단위 테스트
- localStorage: 저장/오프라인 보상
- CSS pixel-art UI: 외부 에셋 없이 도트풍 구현
- 배포: Vercel/Netlify 또는 로컬 build 산출물

## 2. MVP 범위

### 포함
- 모바일 세로형 화면
- 자동 전투/층 진행
- 5층마다 검의 각인 3택
- 10층마다 기억의 파편 3택
- 20/40/60층 보스
- HP 0 또는 보스 제한시간 실패 시 검 파손 → 시간 회귀
- 기억 조각 획득 → 영구 강화
- localStorage 저장/불러오기
- 오프라인 보상
- placeholder 도트 리아/몬스터/검

### 제외
- 실제 캐릭터 일러스트
- 서버/로그인/결제/광고
- 가챠/PvP/길드
- 복잡한 장비 파밍

## 3. 프로젝트 구조

```text
/Users/anheech/reblade
  docs/
    ReBlade_MVP_구현_계획서.md
  src/
    game/
      types.ts
      data.ts
      engine.ts
      storage.ts
      engine.test.ts
      storage.test.ts
    components/
      BattleScreen.tsx
      ChoiceModal.tsx
      UpgradePanel.tsx
      StoryPanel.tsx
      PixelHero.tsx
    App.tsx
    App.css
    main.tsx
```

## 4. 데이터 모델

- `GameState`: 현재 루프/영구 성장/자원/선택지/로그
- `PermanentUpgrades`: 기억 조각으로 올리는 성장
- `RunStats`: 현재 층, HP, 골드, 루프 각인/기억 파편
- `Choice`: 3택 효과 정의
- `Enemy`: 일반 몬스터/보스 정의

## 5. 전투 공식 MVP

- 플레이어 피해량: `(기본 공격 + 영구 공격 보정 + 검 공격 보정) * 각인 배율`
- 몬스터 HP: `층 기반 HP * 보스 배율`
- 몬스터 피해: `층 기반 피해 - 영구 생존 보정`
- 전투 tick: 1초마다 자동 계산
- 몬스터 처치 시 다음 층으로 이동
- 보스는 20층마다 등장, 제한 tick 초과 시 검 파손

## 6. TDD 대상

1. 새 게임 상태 생성
2. 일반 몬스터 처치 시 층 상승/보상 지급
3. 5층/10층 선택지 발생
4. 선택지 적용 시 능력치 변화
5. HP 0 시 회귀 처리와 기억 조각 지급
6. 영구 강화 구매
7. 저장/불러오기
8. 오프라인 보상 계산

## 7. 구현 순서

1. Vite React TS 프로젝트 생성
2. Vitest 설정
3. 게임 타입/데이터 작성
4. engine 테스트 작성 후 구현
5. storage 테스트 작성 후 구현
6. React UI 연결
7. 도트풍 CSS/placeholder 캐릭터 적용
8. 프로덕션 build 검증
9. 로컬 preview 검증
10. 출시용 안내 문서 작성

## 8. 출시 기준

- `npm test` 통과
- `npm run build` 통과
- 모바일 폭 390px 기준 UI 깨지지 않음
- 새 게임 → 자동 전투 → 3택 선택 → 보스 → 검 파손 → 회귀 → 강화까지 가능

## 9. 캐릭터 디자인 교체 지점

후추님이 캐릭터 디자인 초안을 주면 다음 파일/컴포넌트만 교체한다.

- `src/components/PixelHero.tsx`
- `src/App.css`의 `.pixel-hero`, `.pixel-sword`, 색상 토큰
- 필요 시 `/public/assets/`에 이미지 추가

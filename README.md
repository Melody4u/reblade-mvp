# Re:Blade MVP

도트 미소녀 방치형 로그라이트 RPG 프로토타입.

> 검이 부러지면, 시간은 다시 시작된다.

## 공개 테스트 URL

https://melody4u.github.io/reblade-mvp/?v=2

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:5173` 접속.

## 테스트/빌드

```bash
npm test
npm run build
npm run preview
```

## 현재 MVP 기능

- 자동 전투와 층 진행
- 20/40/60층 보스 데이터
- 골드로 검/방어구/시계 장신구 강화
- 검 파손 → 시간 회귀
- 회귀 후 다음 던전 특성 3택 선택
- 기억 조각 영구 강화
- localStorage 저장
- 오프라인 보상
- 모바일 세로형 UI
- placeholder 도트 캐릭터

## 캐릭터 디자인 교체

후추님이 캐릭터 디자인 초안을 주면 아래를 교체한다.

- `src/components/PixelHero.tsx`
- `src/App.css`의 `.pixel-hero`, `.pixel-sword`, 색상 토큰
- 이미지 기반으로 갈 경우 `public/assets/` 추가

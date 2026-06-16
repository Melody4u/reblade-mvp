# Re:Blade MVP 출시 체크리스트

## 완료된 검증

- `npm test`: Vitest 9개 통과
- `npm run build`: Vite production build 성공
- 브라우저 실행: `http://127.0.0.1:5173`에서 UI/자동전투/3택 선택 확인

## 로컬 출시 산출물

- 빌드 결과: `/Users/anheech/reblade/dist/`
- ZIP 패키지: `/Users/anheech/reblade-release.zip`

## 배포 옵션

### Vercel

```bash
cd /Users/anheech/reblade
npx vercel --prod
```

로그인이 필요하면 브라우저 인증 후 진행.

### Netlify

```bash
cd /Users/anheech/reblade
npx netlify deploy --prod --dir=dist
```

로그인이 필요하면 인증 후 진행.

### 정적 호스팅 수동 업로드

`dist/` 폴더 전체를 itch.io, Netlify Drop, Cloudflare Pages, GitHub Pages 등에 업로드.

## 출시 전 후추님 입력 필요

- 캐릭터 디자인 초안
- 게임 소개문 톤: 어두운 감성 / 가벼운 모바일식 중 선택
- 공개 범위: 지인 테스트 / 커뮤니티 테스트 / 공개 출시

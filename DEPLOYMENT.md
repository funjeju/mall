# 🚀 배포 가이드

## 배포 상태

✅ GitHub 저장소: https://github.com/funjeju/mall.git  
✅ 배포 설정 파일 준비 완료

## Vercel 배포 방법

### 방법 1: Vercel Dashboard (권장)

1. **Vercel 계정 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "Add New Project" 클릭
   - GitHub 저장소 `funjeju/mall` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: Vite (자동 감지됨)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **환경 변수 설정 (중요!)**
   
   Environment Variables 섹션에서 다음 변수를 추가:
   
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TOSS_CLIENT_KEY=your_toss_client_key
   ```

5. **Deploy 클릭**

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 실행
cd C:\Users\na\Desktop\vibecoding\my-react-app
vercel

# 프로덕션 배포
vercel --prod
```

## 환경 변수 가져오기

### Supabase 설정

1. Supabase 프로젝트 대시보드 접속: https://supabase.com/dashboard
2. Project Settings → API 섹션에서 확인:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` 키 → `VITE_SUPABASE_ANON_KEY`

### Toss Payments 설정 (결제 기능 사용 시)

1. Toss Payments 개발자센터 접속: https://developers.tosspayments.com/
2. 내 애플리케이션 → Client Key 복사 → `VITE_TOSS_CLIENT_KEY`

## 배포 후 확인사항

- [ ] 사이트가 정상적으로 로드되는지 확인
- [ ] 로그인/회원가입 기능 테스트
- [ ] 상품 목록 로딩 확인
- [ ] 장바구니 기능 테스트
- [ ] 결제 기능 테스트 (테스트 모드)

## 자동 배포 설정

Vercel은 GitHub와 자동으로 연동됩니다:
- `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
- PR을 생성하면 자동으로 프리뷰 배포 생성

## 커스텀 도메인 설정 (선택사항)

1. Vercel Dashboard → Project Settings → Domains
2. 원하는 도메인 입력 및 DNS 설정
3. SSL 인증서는 자동으로 발급됨

## 문제 해결

### 빌드 에러 발생 시

1. 환경 변수가 올바르게 설정되었는지 확인
2. Vercel Dashboard → Deployments → 실패한 배포 클릭 → 로그 확인

### Supabase 연결 에러

- `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`가 정확한지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 페이지 새로고침 시 404 에러

- `vercel.json` 파일에 리다이렉트 설정이 포함되어 있어 문제없음
- 만약 문제가 발생하면 Vercel Dashboard에서 다시 배포

## 로컬 개발 환경

로컬에서 개발할 때는 `.env` 파일 생성:

```bash
# .env 파일 생성
cp env.example .env

# .env 파일에 실제 값 입력
# 그 다음 개발 서버 실행
npm run dev
```

---

**배포 완료 후 프로젝트 URL을 README.md에 추가하세요!**


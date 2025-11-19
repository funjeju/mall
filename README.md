# 🛒 React 쇼핑몰 애플리케이션

React 19 + Vite + Tailwind CSS + shadcn/ui로 구축된 현대적인 쇼핑몰 웹 애플리케이션입니다.

## 🚀 기능

- ✅ 상품 목록 및 상세 페이지
- ✅ 장바구니 기능
- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 결제 시스템 (Toss Payments 연동)
- ✅ 반응형 디자인

## 🛠️ 기술 스택

- **프론트엔드**: React 19, TypeScript/JavaScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS, shadcn/ui
- **백엔드**: Supabase
- **결제**: Toss Payments
- **배포**: Vercel

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 🔑 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

자세한 내용은 `env.example` 파일을 참조하세요.

## 📖 문서

- [배포 가이드](./DEPLOYMENT.md)
- [Supabase 설정](./SUPABASE_SETUP.md)
- [카트 설정](./CART_SETUP.md)
- [결제 설정](./CHECKOUT_SETUP.md)

## 🌐 배포

이 프로젝트는 Vercel에 배포되어 있습니다.

배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

## 📝 라이선스

MIT License

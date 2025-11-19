# 🔐 회원가입 페이지 설정 완료!

## ✅ 완료된 작업

### 1. 데이터베이스 설정

#### profiles 테이블 생성
- ✅ `profiles` 테이블 생성 (RLS 비활성화)
  - `id` (UUID, Primary Key, auth.users 참조)
  - `email` (TEXT, UNIQUE)
  - `name` (TEXT)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

#### 자동 프로필 생성 트리거
- ✅ `handle_new_user()` 함수 생성
- ✅ `on_auth_user_created` 트리거 설정
- **회원가입 시 자동으로 profiles 테이블에 사용자 정보 입력됨**

### 2. UI 컴포넌트 생성

다음 shadcn/ui 스타일 컴포넌트들이 생성되었습니다:
- ✅ `Button` - 버튼 컴포넌트
- ✅ `Card` - 카드 레이아웃 컴포넌트
- ✅ `Input` - 입력 필드 컴포넌트
- ✅ `Label` - 레이블 컴포넌트
- ✅ `Toast` - 알림 컴포넌트

### 3. 커스텀 훅
- ✅ `use-toast` - Toast 알림 관리 훅

### 4. 회원가입 페이지
- ✅ `/src/pages/SignupPage.tsx` 생성
- ✅ `/src/components/Toaster.tsx` 생성
- ✅ `/src/App.tsx` 업데이트

### 5. 필수 패키지 설치
- ✅ `@radix-ui/react-toast`
- ✅ `class-variance-authority`
- ✅ `clsx`
- ✅ `tailwind-merge`
- ✅ `lucide-react`

## 🎯 회원가입 페이지 기능

### ✨ 구현된 기능

1. **입력 폼**
   - 이메일 (email)
   - 이름 (name)
   - 비밀번호 (password)
   - 비밀번호 확인 (confirmPassword)

2. **실시간 유효성 검증**
   - ✅ 이메일 형식 체크 (정규식)
   - ✅ 이름 최소 2자 이상
   - ✅ 비밀번호 최소 8자
   - ✅ 비밀번호 대소문자 포함
   - ✅ 비밀번호 숫자 포함
   - ✅ 비밀번호 일치 여부

3. **로딩 상태**
   - ✅ 회원가입 버튼 로딩 애니메이션
   - ✅ 로딩 중 버튼 비활성화

4. **Toast 알림**
   - ✅ 성공 시: "회원가입 성공! 🎉"
   - ✅ 이메일 인증 안내 메시지
   - ✅ 실패 시: 에러 메시지 표시

5. **추가 기능**
   - ✅ "이미 계정이 있으신가요? 로그인" 링크
   - ✅ 중앙 카드 형식 레이아웃
   - ✅ 반응형 디자인

## 📊 데이터 흐름

```
사용자 회원가입
    ↓
Supabase Auth에 계정 생성
    ↓
트리거 실행 (on_auth_user_created)
    ↓
handle_new_user() 함수 실행
    ↓
profiles 테이블에 자동으로 유저 정보 입력
    ↓
다른 테이블의 user_id와 연동 준비 완료
```

## 🔧 사용 방법

### 1. 환경 변수 확인

`.env.local` 파일이 있는지 확인:

```env
VITE_SUPABASE_URL=https://yeqyycvmtxkxhxsbjmkp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 확인

`http://localhost:5173` 접속하면 회원가입 페이지가 표시됩니다.

## 📝 코드 예제

### 회원가입 처리 핵심 코드

```typescript
// 회원가입 처리
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      name: formData.name  // 메타데이터로 이름 전달
    }
  }
})

// 자동으로 profiles 테이블에 입력됨 (트리거가 처리)
```

### 실시간 유효성 검증

```typescript
// 이메일 검증
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 비밀번호 검증
const validatePassword = (password: string): boolean => {
  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return minLength && hasUpperCase && hasLowerCase && hasNumber
}
```

### Toast 사용

```typescript
import { useToast } from '@/hooks/use-toast'

const { toast } = useToast()

// 성공 메시지
toast({
  title: "회원가입 성공! 🎉",
  description: "이메일 인증이 필요합니다."
})

// 에러 메시지
toast({
  variant: "destructive",
  title: "회원가입 실패",
  description: error.message
})
```

## 🔗 다른 컴포넌트에서 회원가입 페이지 사용

```typescript
import { SignupPage } from '@/pages/SignupPage'
import { Toaster } from '@/components/Toaster'

function App() {
  return (
    <>
      <SignupPage />
      <Toaster />
    </>
  )
}
```

## 🗃️ profiles 테이블 활용

### 사용자 정보 조회

```typescript
// 현재 로그인한 사용자 프로필 가져오기
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  console.log(profile.name, profile.email)
}
```

### 다른 테이블과 연동

```typescript
// orders 테이블에서 사용자 정보와 함께 조회
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    profiles (
      name,
      email
    )
  `)
  .eq('user_id', userId)
```

## 🎨 커스터마이징

### 페이지 스타일 변경

`SignupPage.tsx`의 Card 컴포넌트 className을 수정:

```typescript
<Card className="w-full max-w-md shadow-xl">
  {/* 더 큰 그림자 효과 */}
</Card>
```

### 유효성 검증 규칙 변경

```typescript
// 비밀번호 최소 길이를 12자로 변경
const minLength = password.length >= 12

// 특수문자 추가 요구
const hasSpecialChar = /[!@#$%^&*]/.test(password)
```

## 🚀 다음 단계

1. **로그인 페이지 생성**
   - 이메일/비밀번호 로그인
   - 비밀번호 찾기
   - 소셜 로그인 (Google, GitHub 등)

2. **이메일 인증 처리**
   - Supabase 대시보드에서 이메일 템플릿 설정
   - 인증 완료 리다이렉트 페이지

3. **사용자 프로필 페이지**
   - 프로필 정보 수정
   - 비밀번호 변경
   - 계정 삭제

4. **RLS (Row Level Security) 설정**
   ```sql
   -- profiles 테이블에 RLS 활성화
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- 사용자는 자신의 프로필만 조회/수정 가능
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);
   ```

## ⚠️ 중요 사항

### 이메일 인증 활성화

Supabase 대시보드에서 이메일 인증을 활성화해야 합니다:

1. Supabase Dashboard → Authentication → Settings
2. "Enable email confirmations" 활성화
3. 이메일 템플릿 커스터마이징

### 보안 설정

프로덕션 환경에서는:
- ✅ HTTPS 사용
- ✅ RLS 활성화
- ✅ 환경 변수 보안
- ✅ Rate limiting 설정

## 📚 관련 파일

- `/src/pages/SignupPage.tsx` - 회원가입 페이지
- `/src/lib/supabase.ts` - Supabase 클라이언트
- `/src/components/Toaster.tsx` - Toast 컨테이너
- `/src/components/ui/` - UI 컴포넌트들
- `/src/hooks/use-toast.ts` - Toast 훅

---

**설정 완료일**: 2025-11-18  
**Supabase 프로젝트**: yeqyycvmtxkxhxsbjmkp  
**테이블**: profiles (자동 생성 트리거 설정됨)  
**기능**: 회원가입, 실시간 유효성 검증, Toast 알림


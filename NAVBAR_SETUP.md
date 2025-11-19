# 🧭 네비게이션 바 설정 완료!

## ✅ 완료된 작업

### 1. UI 컴포넌트 생성
- ✅ `DropdownMenu` - 드롭다운 메뉴
- ✅ `Avatar` - 프로필 아바타
- ✅ `Badge` - 장바구니 개수 뱃지

### 2. Navbar 컴포넌트
- ✅ `/src/components/Navbar.tsx` 생성
- ✅ 인증 상태에 따른 조건부 렌더링
- ✅ Supabase Auth 연동
- ✅ 장바구니 개수 실시간 조회

### 3. 레이아웃 업데이트
- ✅ `App.tsx`에 Navbar 추가
- ✅ 로그인/회원가입 페이지 레이아웃 조정

## 🎯 네비게이션 바 기능

### 좌측: 로고
- "S" 로고 + "쇼핑몰" 텍스트
- 클릭 시 홈(/)으로 이동

### 우측 - 로그인 전
- **로그인** 버튼 (Ghost 스타일)
- **회원가입** 버튼 (Primary 스타일)

### 우측 - 로그인 후
1. **장바구니 아이콘**
   - 장바구니 개수 뱃지 표시
   - 99개 초과 시 "99+" 표시
   - 클릭 시 `/cart` 페이지로 이동

2. **프로필 아바타**
   - 이메일 첫 글자 표시
   - 호버 시 테두리 색상 변경
   - 클릭 시 드롭다운 메뉴 표시

3. **드롭다운 메뉴**
   - 사용자 정보 (이메일, 이름)
   - **내정보** - `/profile` 페이지로 이동
   - **주문 내역** - `/orders` 페이지로 이동
   - **장바구니** - `/cart` 페이지로 이동 (개수 표시)
   - **로그아웃** - 로그아웃 후 `/login`으로 이동

## 📊 장바구니 개수 조회

Supabase를 통해 실시간으로 장바구니 개수를 가져옵니다:

```typescript
async function fetchCartCount(userId: string) {
  const { data, error } = await supabase
    .from('cart')
    .select('quantity')
    .eq('user_id', userId)

  const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
  setCartCount(total)
}
```

## 🎨 스타일링

### 네비게이션 바 특징
- Sticky 위치 (스크롤 시 상단 고정)
- 배경 블러 효과
- 반투명 배경
- 하단 테두리

### 반응형 디자인
- 컨테이너 내 중앙 정렬
- 모바일/데스크톱 호환

## 🔧 사용 방법

### 1. 아이콘 확인

`lucide-react`가 이미 설치되어 있는지 확인:

```bash
npm list lucide-react
```

없다면 설치:

```bash
npm install lucide-react
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 확인

모든 페이지 상단에 네비게이션 바가 표시됩니다.

## 📝 컴포넌트 사용 예제

### Navbar 단독 사용

```typescript
import { Navbar } from '@/components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <main>{/* 페이지 콘텐츠 */}</main>
    </>
  )
}
```

### Avatar 컴포넌트

```typescript
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Badge 컴포넌트

```typescript
import { Badge } from '@/components/ui/badge'

<Badge variant="destructive">99+</Badge>
```

### DropdownMenu 컴포넌트

```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
  <DropdownMenuContent open={isOpen}>
    <DropdownMenuItem>항목 1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>항목 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 🎯 페이지 레이아웃

### 로그인/회원가입 페이지
- 네비게이션 바 높이(4rem)를 고려한 레이아웃
- `min-h-[calc(100vh-4rem)]` 사용

### 일반 페이지
- 네비게이션 바 아래 콘텐츠 배치
- 스크롤 시 네비게이션 바 상단 고정

## 🚀 다음 단계

### 1. 프로필 페이지 만들기

```typescript
// /src/pages/ProfilePage.tsx
export function ProfilePage() {
  // 사용자 정보 조회 및 수정
}
```

### 2. 주문 내역 페이지

```typescript
// /src/pages/OrdersPage.tsx
export function OrdersPage() {
  // 주문 내역 조회
}
```

### 3. 장바구니 페이지

```typescript
// /src/pages/CartPage.tsx
export function CartPage() {
  // 장바구니 상품 목록 및 관리
}
```

### 4. 라우팅 추가

```typescript
// App.tsx
<Routes>
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/orders" element={<OrdersPage />} />
  <Route path="/cart" element={<CartPage />} />
</Routes>
```

## 🎨 커스터마이징

### 로고 변경

```typescript
// Navbar.tsx
<Link to="/" className="flex items-center space-x-2">
  <img src="/logo.png" alt="로고" className="h-10 w-10" />
  <span className="text-xl font-bold">내 쇼핑몰</span>
</Link>
```

### 메뉴 항목 추가

```typescript
// Navbar.tsx - 드롭다운 메뉴에 추가
<DropdownMenuItem onClick={() => navigate('/settings')}>
  <Settings className="mr-2 h-4 w-4" />
  <span>설정</span>
</DropdownMenuItem>
```

### 장바구니 개수 실시간 업데이트

Supabase Realtime을 사용:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('cart_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cart',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        fetchCartCount(user.id)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user])
```

## 📁 생성된 파일

- `/src/components/Navbar.tsx` - 네비게이션 바
- `/src/components/ui/dropdown-menu.tsx` - 드롭다운 메뉴
- `/src/components/ui/avatar.tsx` - 아바타
- `/src/components/ui/badge.tsx` - 뱃지
- `/src/App.tsx` - 업데이트 (Navbar 추가)
- `/src/pages/SignupPage.tsx` - 레이아웃 조정
- `/src/pages/LoginPage.tsx` - 레이아웃 조정

## 🎉 완성!

네비게이션 바가 모든 페이지에 표시됩니다:
- ✅ 인증 상태 감지
- ✅ 조건부 렌더링
- ✅ 장바구니 개수 표시
- ✅ 드롭다운 메뉴
- ✅ 반응형 디자인

---

**설정 완료일**: 2025-11-18  
**기능**: 네비게이션 바, 인증 상태 기반 UI, 장바구니 개수 뱃지



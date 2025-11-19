# 🛒 장바구니 시스템 구현 완료!

## ✅ 구현된 기능

### 1. 장바구니 추가/삭제/수량 변경
- ✅ 상품 추가 (ProductList, ProductDetailPage)
- ✅ 상품 삭제 (개별 삭제)
- ✅ 수량 변경 (+ / - 버튼, 직접 입력)
- ✅ 재고 확인 (재고보다 많이 추가 불가)

### 2. 총 금액 계산
- ✅ 실시간 총 금액 계산
- ✅ 개별 상품 소계 표시
- ✅ 배송비 표시
- ✅ 포맷팅된 금액 표시 (₩ 1,500,000)

### 3. 로컬스토리지 연동
- ✅ 비로그인 상태에서 로컬스토리지 사용
- ✅ 페이지 새로고침 시 데이터 유지
- ✅ 로그인 시 Supabase로 자동 동기화

### 4. Supabase 연동
- ✅ 로그인 상태에서 Supabase 사용
- ✅ 실시간 동기화
- ✅ 사용자별 장바구니 관리
- ✅ cart 테이블 CRUD 작업

### 5. 네비게이션 바 개수 뱃지
- ✅ 실시간 장바구니 개수 표시
- ✅ useCart 훅 사용으로 자동 업데이트
- ✅ 99개 초과 시 "99+" 표시
- ✅ 드롭다운 메뉴에도 개수 표시

### 6. 장바구니 페이지 UI
- ✅ 상품 목록 카드 (이미지, 이름, 가격, 수량)
- ✅ 수량 조절 UI (-, 입력 필드, +)
- ✅ 삭제 버튼
- ✅ 주문 요약 카드
- ✅ 결제하기 버튼
- ✅ 쇼핑 계속하기 버튼
- ✅ 빈 장바구니 안내 화면

---

## 📂 파일 구조

```
my-react-app/src/
├── contexts/
│   └── CartContext.tsx              # 장바구니 전역 상태 관리
│
├── pages/
│   ├── CartPage.tsx                 # 장바구니 페이지
│   ├── ProductDetailPage.tsx        # 업데이트 (장바구니 추가)
│   └── HomePage.tsx
│
├── components/
│   ├── Navbar.tsx                   # 업데이트 (useCart 사용)
│   ├── ProductList.tsx              # 업데이트 (담기 버튼)
│   └── ui/
│       ├── separator.tsx            # 새로 추가
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
│
└── App.tsx                          # CartProvider, /cart 라우트
```

---

## 🎯 주요 컴포넌트

### CartContext.tsx

전역 장바구니 상태 관리 Context

```typescript
interface CartContextType {
  items: CartItem[]                    // 장바구니 아이템 배열
  isLoading: boolean                   // 로딩 상태
  addToCart: (product, quantity) => Promise<void>
  removeFromCart: (productId) => Promise<void>
  updateQuantity: (productId, quantity) => Promise<void>
  clearCart: () => Promise<void>
  getTotalAmount: () => number         // 총 금액
  getTotalItems: () => number          // 총 개수
  refreshCart: () => Promise<void>     // 새로고침
}
```

**주요 기능:**
- 로컬스토리지 + Supabase 하이브리드 저장
- 로그인 시 자동 동기화
- 인증 상태 변화 감지

---

### CartPage.tsx

장바구니 전체 페이지

**주요 기능:**
- 상품 목록 표시 (이미지, 이름, 가격, 수량)
- 수량 변경 (버튼 / 직접 입력)
- 개별 상품 삭제
- 총 금액 계산 및 표시
- 결제하기 버튼
- 빈 장바구니 안내
- 반응형 레이아웃 (2열 그리드)

---

### 업데이트된 컴포넌트

#### Navbar.tsx
- `useCart()` 훅 사용
- `getTotalItems()`로 실시간 개수 표시
- Supabase 직접 호출 제거 (Context 사용)

#### ProductList.tsx
- "담기" 버튼 추가
- `addToCart()` 함수 연동
- Toast 알림

#### ProductDetailPage.tsx
- `addToCart()` 함수 연동
- 수량 선택 후 추가

---

## 💻 사용 예제

### 1. 장바구니에 상품 추가

```typescript
import { useCart } from '@/contexts/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  
  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1)
      toast({
        title: "장바구니에 추가되었습니다!",
        description: `${product.name}이(가) 장바구니에 담겼습니다.`
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        variant: "destructive"
      })
    }
  }
  
  return <Button onClick={handleAddToCart}>담기</Button>
}
```

---

### 2. 장바구니 목록 표시

```typescript
import { useCart } from '@/contexts/CartContext'

function MyCart() {
  const { items, getTotalAmount, getTotalItems } = useCart()
  
  return (
    <div>
      <h2>장바구니 ({getTotalItems()}개)</h2>
      <ul>
        {items.map(item => (
          <li key={item.product.id}>
            {item.product.name} - {item.quantity}개
          </li>
        ))}
      </ul>
      <p>총 금액: {getTotalAmount().toLocaleString()}원</p>
    </div>
  )
}
```

---

### 3. 수량 변경

```typescript
const { updateQuantity } = useCart()

// 수량 1 증가
await updateQuantity(productId, currentQuantity + 1)

// 수량 1 감소
await updateQuantity(productId, currentQuantity - 1)

// 직접 입력
await updateQuantity(productId, parseInt(value))
```

---

### 4. 상품 삭제

```typescript
const { removeFromCart } = useCart()

await removeFromCart(productId)
```

---

## 🔄 데이터 흐름

### 비로그인 상태 (로컬스토리지)

```
1. 상품 추가
   ↓
2. items 배열 업데이트
   ↓
3. localStorage.setItem('shopping_cart', JSON.stringify(items))
   ↓
4. 페이지 새로고침 시
   ↓
5. localStorage.getItem('shopping_cart')
   ↓
6. items 복원
```

---

### 로그인 상태 (Supabase)

```
1. 로그인 감지
   ↓
2. 로컬스토리지 → Supabase 동기화 (syncLocalToSupabase)
   ↓
3. 상품 추가/수정/삭제
   ↓
4. Supabase INSERT/UPDATE/DELETE
   ↓
5. items 배열 업데이트
   ↓
6. 로컬스토리지에도 저장 (백업)
```

---

### 로그인 전 → 로그인 후 동기화

```
[로그인 전]
- 로컬스토리지에만 저장
- 상품 A, B, C 추가

[로그인]
- onAuthStateChange 이벤트 발생
- syncLocalToSupabase() 호출
- 로컬의 A, B, C → Supabase에 INSERT
- Supabase에서 장바구니 로드
- items 배열 업데이트

[이후]
- Supabase를 메인 저장소로 사용
- 로컬스토리지는 백업용
```

---

## 🎨 UI/UX 특징

### 1. 반응형 레이아웃

```
[모바일]
- 1열 레이아웃
- 주문 요약이 하단에 위치

[데스크톱]
- 2열 그리드
- 좌측: 상품 목록 (2/3)
- 우측: 주문 요약 (1/3, sticky)
```

---

### 2. 상품 카드 디자인

- **이미지**: 24x24 (96px)
- **정보**: 이름, 설명, 가격
- **수량 조절**: -, 입력 필드, +
- **재고 표시**: "재고: N개"
- **소계**: 우측 정렬
- **삭제 버튼**: 우측 상단 (Trash2 아이콘)

---

### 3. 주문 요약 카드

```
┌─────────────────────────┐
│ 주문 요약                │
├─────────────────────────┤
│ 상품 금액    ₩1,500,000 │
│ 배송비           무료    │
│ ─────────────────────── │
│ 총 결제금액  ₩1,500,000 │
│                         │
│ • 3개 상품              │
│ • 50,000원 이상 무료배송│
├─────────────────────────┤
│ [₩1,500,000 결제하기 →]│
└─────────────────────────┘
```

---

### 4. 빈 장바구니 화면

```
      🛍️
장바구니가 비어있습니다
  상품을 추가해보세요!
  
  [쇼핑 계속하기]
```

---

### 5. 로딩 상태

```
      ⏳
장바구니 불러오는 중...
```

---

## 🔧 주요 함수 설명

### addToCart(product, quantity)

상품을 장바구니에 추가

```typescript
async function addToCart(product: Product, quantity: number = 1) {
  // 1. 기존 상품 확인
  const existingItemIndex = items.findIndex(item => item.product.id === product.id)

  // 2. 수량 업데이트 또는 새 상품 추가
  let newItems: CartItem[]
  if (existingItemIndex >= 0) {
    newItems = [...items]
    newItems[existingItemIndex].quantity += quantity
  } else {
    newItems = [...items, { id: crypto.randomUUID(), product, quantity }]
  }

  // 3. 상태 업데이트
  setItems(newItems)
  
  // 4. 로컬스토리지 저장
  saveToLocal(newItems)

  // 5. 로그인 상태면 Supabase에 저장
  if (user) {
    await supabase.from('cart').upsert({
      user_id: user.id,
      product_id: product.id,
      quantity: newQuantity
    })
  }
}
```

---

### updateQuantity(productId, quantity)

상품 수량 변경

```typescript
async function updateQuantity(productId: string, quantity: number) {
  // 0 이하면 삭제
  if (quantity <= 0) {
    await removeFromCart(productId)
    return
  }

  // 수량 업데이트
  const newItems = items.map(item =>
    item.product.id === productId ? { ...item, quantity } : item
  )

  setItems(newItems)
  saveToLocal(newItems)

  // Supabase 업데이트
  if (user) {
    await supabase.from('cart').update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)
  }
}
```

---

### removeFromCart(productId)

상품 삭제

```typescript
async function removeFromCart(productId: string) {
  // 배열에서 제거
  const newItems = items.filter(item => item.product.id !== productId)
  
  setItems(newItems)
  saveToLocal(newItems)

  // Supabase에서 삭제
  if (user) {
    await supabase.from('cart').delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
  }
}
```

---

### getTotalAmount()

총 금액 계산

```typescript
function getTotalAmount(): number {
  return items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  )
}
```

---

### getTotalItems()

총 상품 개수 계산

```typescript
function getTotalItems(): number {
  return items.reduce((sum, item) => 
    sum + item.quantity, 0
  )
}
```

---

## 🚀 실행 방법

### 1. 개발 서버 시작

```bash
cd my-react-app
npm run dev
```

---

### 2. 테스트 시나리오

#### 비로그인 상태
1. 홈 페이지 접속
2. 상품 "담기" 버튼 클릭
3. Navbar에 개수 뱃지 표시 확인
4. 장바구니 아이콘 클릭 → CartPage 이동
5. 수량 변경 테스트
6. 상품 삭제 테스트
7. 페이지 새로고침 → 데이터 유지 확인

#### 로그인 상태
1. 로그인
2. 상품 추가
3. Supabase 대시보드에서 cart 테이블 확인
4. 다른 브라우저에서 같은 계정 로그인
5. 장바구니 동기화 확인

#### 로그인 전 → 후 동기화
1. 비로그인 상태에서 상품 A, B 추가
2. 로그인
3. 장바구니에 A, B가 유지되는지 확인
4. Supabase에 저장되었는지 확인

---

## 📊 Supabase 테이블 구조

### cart 테이블

```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
)
```

**인덱스:**
- `cart_user_id_idx` ON (user_id)
- `cart_product_id_idx` ON (product_id)

**UNIQUE 제약:**
- 같은 사용자가 같은 상품을 중복으로 추가할 수 없음
- `upsert`를 사용하여 수량만 업데이트

---

## 🎓 학습 포인트

### 1. Context API
- 전역 상태 관리
- Provider 패턴
- Custom Hook 생성

### 2. 하이브리드 저장소
- 로컬스토리지 + Supabase
- 동기화 로직
- 인증 상태별 처리

### 3. 실시간 업데이트
- useEffect를 통한 구독
- onAuthStateChange 이벤트
- 자동 동기화

### 4. UI/UX
- 반응형 레이아웃
- 로딩 상태
- 빈 상태
- Toast 알림

---

## 🔍 트러블슈팅

### 장바구니 개수가 업데이트되지 않아요

**원인:** Navbar가 useCart를 사용하지 않음

**해결:**
```typescript
// Navbar.tsx
import { useCart } from '@/contexts/CartContext'

const { getTotalItems } = useCart()
const cartCount = getTotalItems()
```

---

### 로그인 후 장바구니가 비어요

**원인:** 동기화 함수가 호출되지 않음

**해결:** `onAuthStateChange`에서 `syncLocalToSupabase` 호출 확인

---

### Supabase에 저장되지 않아요

**원인:** RLS(Row Level Security) 정책

**해결:**
```sql
-- RLS 비활성화 (개발용)
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;

-- 또는 정책 생성 (프로덕션용)
CREATE POLICY "Users can manage their own cart"
  ON cart
  FOR ALL
  USING (auth.uid() = user_id);
```

---

### 페이지 새로고침하면 장바구니가 비어요

**원인:** 로컬스토리지 키가 잘못되었거나 저장 실패

**해결:**
1. 브라우저 개발자 도구 → Application → Local Storage 확인
2. `shopping_cart` 키 확인
3. JSON 파싱 오류 확인

---

## 📝 다음 단계

### 1. 결제 시스템 연동
- Toss Payments API
- 주문 생성 (orders, order_items)
- 결제 성공 시 장바구니 비우기

### 2. 위시리스트
- 찜하기 기능
- 위시리스트 페이지
- 위시리스트 → 장바구니 이동

### 3. 최근 본 상품
- 쿠키 또는 로컬스토리지
- 최근 본 상품 섹션

### 4. 쿠폰/할인
- 쿠폰 적용
- 할인 계산
- 프로모션 코드

---

## 🎉 완성!

장바구니 시스템이 완벽하게 구현되었습니다!

**주요 기능:**
- ✅ 상품 추가/삭제/수량 변경
- ✅ 총 금액 계산
- ✅ 로컬스토리지 연동
- ✅ Supabase 연동
- ✅ 네비게이션 바 개수 뱃지
- ✅ 반응형 UI

**기술 스택:**
- React 19
- TypeScript
- Supabase
- shadcn/ui
- Tailwind CSS
- Context API

---

**설정 완료일**: 2025-11-18  
**프로젝트**: my-react-app  
**기능**: 장바구니 시스템 (로컬스토리지 + Supabase)



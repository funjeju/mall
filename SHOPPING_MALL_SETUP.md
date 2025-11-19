# 🛍️ 쇼핑몰 Supabase 설정 완료!

## ✅ 완료된 작업

### 1. 데이터베이스 테이블 생성

모든 테이블이 성공적으로 생성되었습니다:

#### 📦 products (상품)
- `id` (UUID, Primary Key)
- `name` (TEXT, 상품명)
- `description` (TEXT, 상품 설명)
- `price` (DECIMAL, 가격)
- `image_url` (TEXT, 이미지 URL)
- `stock` (INTEGER, 재고)
- `category` (TEXT, 카테고리)
- `created_at` (TIMESTAMP, 생성일시)

#### 🛒 orders (주문)
- `id` (UUID, Primary Key)
- `user_id` (UUID, 사용자 ID)
- `total_amount` (DECIMAL, 총 금액)
- `status` (TEXT, 주문 상태: pending, completed, cancelled)
- `payment_key` (TEXT, 결제 키)
- `created_at` (TIMESTAMP, 생성일시)

#### 📝 order_items (주문 상품)
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → orders)
- `product_id` (UUID, Foreign Key → products)
- `quantity` (INTEGER, 수량)
- `price` (DECIMAL, 가격)

#### 🛍️ cart (장바구니)
- `id` (UUID, Primary Key)
- `user_id` (UUID, 사용자 ID)
- `product_id` (UUID, Foreign Key → products)
- `quantity` (INTEGER, 수량)
- `created_at` (TIMESTAMP, 생성일시)
- UNIQUE 제약: (user_id, product_id) - 같은 사용자가 같은 상품을 중복 추가 방지

### 2. RLS (Row Level Security) 설정
- ✅ 모든 테이블 RLS **비활성화** (개발 편의성)

### 3. 인덱스 생성 (성능 최적화)
- `products.category` - 카테고리별 조회 최적화
- `orders.user_id` - 사용자별 주문 조회 최적화
- `orders.status` - 주문 상태별 조회 최적화
- `order_items.order_id` - 주문별 상품 조회 최적화
- `order_items.product_id` - 상품별 주문 조회 최적화
- `cart.user_id` - 사용자별 장바구니 조회 최적화
- `cart.product_id` - 상품별 장바구니 조회 최적화

### 4. 샘플 데이터 추가
- ✅ 6개의 샘플 상품 추가됨 (전자기기 카테고리)

### 5. TypeScript 클라이언트 설정
- ✅ `/src/lib/supabase.ts` 생성
- ✅ 타입 정의 포함 (Product, Order, OrderItem, Cart)

## 🎯 데이터베이스 구조

```
products (상품)
  ↓
  ├─→ order_items (주문에 포함된 상품)
  │      ↓
  │   orders (주문)
  │
  └─→ cart (장바구니)
```

## 📝 주요 기능 예제

### 1. 상품 목록 조회

```typescript
import { supabase, Product } from '@/lib/supabase'

const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
```

### 2. 카테고리별 상품 조회

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', '전자기기')
```

### 3. 장바구니에 추가

```typescript
const { error } = await supabase
  .from('cart')
  .insert([{
    user_id: 'user-uuid',
    product_id: 'product-uuid',
    quantity: 1
  }])
```

### 4. 장바구니 조회 (상품 정보 포함)

```typescript
const { data: cartItems, error } = await supabase
  .from('cart')
  .select(`
    *,
    products (
      id,
      name,
      price,
      image_url
    )
  `)
  .eq('user_id', 'user-uuid')
```

### 5. 주문 생성

```typescript
// 1. 주문 생성
const { data: order, error } = await supabase
  .from('orders')
  .insert([{
    user_id: 'user-uuid',
    total_amount: 150000,
    status: 'pending'
  }])
  .select()
  .single()

// 2. 주문 상품 추가
const { error: itemsError } = await supabase
  .from('order_items')
  .insert([
    {
      order_id: order.id,
      product_id: 'product-uuid',
      quantity: 2,
      price: 75000
    }
  ])
```

### 6. 주문 내역 조회

```typescript
const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      products (
        name,
        image_url
      )
    )
  `)
  .eq('user_id', 'user-uuid')
  .order('created_at', { ascending: false })
```

## 🚀 사용 가능한 React 컴포넌트

`/src/examples/ShoppingMallExamples.tsx` 파일에 다음 컴포넌트들이 준비되어 있습니다:

1. **ProductList** - 상품 목록 표시
2. **ProductsByCategory** - 카테고리별 상품 조회
3. **AddToCart** - 장바구니에 상품 추가
4. **CartList** - 장바구니 조회 및 관리
5. **createOrder** - 주문 생성 함수
6. **OrderHistory** - 주문 내역 표시

## 📦 샘플 데이터

다음 샘플 상품들이 추가되어 있습니다:

1. **노트북** - 1,500,000원 (재고: 10개)
2. **무선 마우스** - 35,000원 (재고: 50개)
3. **기계식 키보드** - 120,000원 (재고: 30개)
4. **모니터** - 450,000원 (재고: 15개)
5. **헤드셋** - 89,000원 (재고: 25개)
6. **웹캠** - 65,000원 (재고: 20개)

## 🔧 MCP 명령어로 데이터 조회

```typescript
// 테이블 목록 확인
mcp_supabase_list_tables

// SQL 직접 실행
mcp_supabase_execute_sql({ query: "SELECT * FROM products" })

// 마이그레이션 목록
mcp_supabase_list_migrations
```

## ⚠️ 중요 사항

### RLS (Row Level Security)가 비활성화되어 있습니다
현재 모든 테이블의 RLS가 꺼져 있어 누구나 접근 가능합니다. 
프로덕션 환경에서는 반드시 RLS를 활성화하고 정책을 설정하세요.

```sql
-- RLS 활성화 예제
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 예제
CREATE POLICY "누구나 상품 조회 가능"
  ON products FOR SELECT
  USING (true);

-- 쓰기 정책 예제
CREATE POLICY "인증된 사용자만 장바구니 추가 가능"
  ON cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 📚 다음 단계

1. ✅ 환경 변수 설정 확인 (`.env.local`)
2. shadcn/ui 컴포넌트 설치 (Button, Card, Input)
3. 예제 컴포넌트를 `App.jsx`에 import하여 테스트
4. 인증 시스템 추가 (Supabase Auth)
5. 결제 시스템 연동 (Toss Payments 등)

## 🎨 UI 컴포넌트 설치

예제를 사용하려면 다음 shadcn/ui 컴포넌트가 필요합니다:

```bash
npx shadcn@latest add button card input
```

## 🔐 사용자 인증 추가 (선택사항)

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

```typescript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

function LoginPage() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
    />
  )
}
```

---

**설정 완료일**: 2025-11-18  
**Supabase 프로젝트**: yeqyycvmtxkxhxsbjmkp  
**테이블**: products, orders, order_items, cart  
**샘플 데이터**: 6개 상품 추가됨


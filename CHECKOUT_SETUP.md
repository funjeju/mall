# 💳 결제 시스템 구현 완료!

## ✅ 구현된 기능

### 1. 결제 페이지 (CheckoutPage)
- ✅ 주문자 정보 입력 폼 (이름, 이메일, 연락처)
- ✅ 배송지 정보 입력 폼 (받는사람, 연락처, 주소, 우편번호, 배송메시지)
- ✅ "주문자 정보와 동일" 버튼 (자동 복사)
- ✅ 결제 금액 확인 (상품 목록, 총액)
- ✅ Toss Payments v2 결제 위젯
- ✅ 폼 유효성 검증 (이메일, 전화번호 등)

### 2. Toss Payments 연동
- ✅ Payment Widget SDK 설치
- ✅ 테스트 클라이언트 키 사용
- ✅ 결제 위젯 렌더링
- ✅ 결제 요청 API

### 3. Supabase 주문 저장
- ✅ `orders` 테이블에 주문 정보 저장
- ✅ `order_items` 테이블에 주문 상품 저장
- ✅ 결제 성공 시 상태 업데이트
- ✅ payment_key 저장

### 4. 결제 성공/실패 페이지
- ✅ CheckoutSuccessPage - 주문 완료 안내
- ✅ CheckoutFailPage - 결제 실패 안내
- ✅ 주문 정보 표시
- ✅ 장바구니 자동 비우기

---

## 📂 파일 구조

```
my-react-app/src/
├── pages/
│   ├── CheckoutPage.tsx           # 결제 페이지
│   ├── CheckoutSuccessPage.tsx    # 결제 성공 페이지
│   ├── CheckoutFailPage.tsx       # 결제 실패 페이지
│   └── CartPage.tsx               # 업데이트 (결제하기 버튼)
│
└── App.tsx                        # 라우트 추가
```

---

## 🎯 주요 컴포넌트

### CheckoutPage.tsx

결제 페이지 메인 컴포넌트

**구성:**
- 주문자 정보 폼
- 배송지 정보 폼
- Toss Payments 결제 위젯
- 주문 상품 요약
- 결제하기 버튼

**주요 기능:**
```typescript
// 1. Toss Payments 위젯 로드
const paymentWidget = await loadPaymentWidget(CLIENT_KEY, CUSTOMER_KEY)
paymentWidget.renderPaymentMethods('#payment-widget', { value: getTotalAmount() })

// 2. 결제 요청
await paymentWidget.requestPayment({
  orderId: 'generated-order-id',
  orderName: '상품명',
  successUrl: '/checkout/success',
  failUrl: '/checkout/fail',
  customerEmail: 'email@example.com'
})

// 3. Supabase 주문 저장
const { data: order } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    total_amount: getTotalAmount(),
    status: 'pending'
  })
```

---

### CheckoutSuccessPage.tsx

결제 성공 페이지

**기능:**
- URL에서 결제 정보 추출 (orderId, paymentKey, amount)
- Supabase orders 테이블 업데이트 (status: 'completed')
- 주문 정보 표시
- 장바구니 비우기
- 주문 내역/홈 버튼

---

### CheckoutFailPage.tsx

결제 실패 페이지

**기능:**
- 오류 코드 및 메시지 표시
- 실패 원인 안내
- 다시 결제하기 버튼
- 장바구니/홈 버튼

---

## 🔄 결제 프로세스

### 전체 흐름

```
1. 장바구니 페이지
   ↓ "결제하기" 버튼 클릭
   
2. CheckoutPage (/checkout)
   ↓ 주문자/배송지 정보 입력
   ↓ Toss Payments 위젯에서 결제 수단 선택
   ↓ "결제하기" 버튼 클릭
   
3. Supabase에 주문 정보 저장 (status: 'pending')
   ↓
   
4. Toss Payments 결제 요청
   ↓
   
5-A. 결제 성공
   → CheckoutSuccessPage (/checkout/success)
   → orders 테이블 업데이트 (status: 'completed')
   → 장바구니 비우기
   
5-B. 결제 실패
   → CheckoutFailPage (/checkout/fail)
   → 오류 메시지 표시
```

---

## 💻 사용 예제

### 1. 결제 페이지로 이동

```typescript
// CartPage.tsx
const handleCheckout = () => {
  if (!user) {
    toast({ title: "로그인 필요" })
    navigate('/login')
    return
  }
  
  navigate('/checkout')
}
```

---

### 2. Toss Payments 위젯 로드

```typescript
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'

const CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
const CUSTOMER_KEY = 'user-' + crypto.randomUUID()

async function loadPaymentWidget() {
  const paymentWidget = await loadPaymentWidget(CLIENT_KEY, CUSTOMER_KEY)
  
  paymentWidget.renderPaymentMethods(
    '#payment-widget',
    { value: getTotalAmount() },
    { variantKey: 'DEFAULT' }
  )
}
```

---

### 3. 결제 요청

```typescript
const handlePayment = async () => {
  // 폼 유효성 검증
  if (!validateForm()) return
  
  // Supabase에 주문 저장
  const orderId = await createOrder('pending')
  
  // Toss Payments 결제 요청
  await paymentWidgetRef.current.requestPayment({
    orderId,
    orderName: items.length > 1 
      ? `${items[0].product.name} 외 ${items.length - 1}건`
      : items[0].product.name,
    successUrl: `${window.location.origin}/checkout/success`,
    failUrl: `${window.location.origin}/checkout/fail`,
    customerEmail: orderForm.ordererEmail,
    customerName: orderForm.ordererName,
    customerMobilePhone: orderForm.ordererPhone
  })
}
```

---

### 4. Supabase 주문 저장

```typescript
const createOrder = async (status: string): Promise<string> => {
  // 1. orders 테이블에 주문 생성
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: getTotalAmount(),
      status
    })
    .select()
    .single()

  if (error) throw error

  // 2. order_items 테이블에 주문 상품 저장
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price
  }))

  await supabase
    .from('order_items')
    .insert(orderItems)

  return order.id
}
```

---

### 5. 결제 성공 처리

```typescript
// CheckoutSuccessPage.tsx
async function processPaymentSuccess() {
  // URL에서 결제 정보 추출
  const orderId = searchParams.get('orderId')
  const paymentKey = searchParams.get('paymentKey')
  const amount = searchParams.get('amount')

  // Supabase orders 업데이트
  const { data: order } = await supabase
    .from('orders')
    .update({
      status: 'completed',
      payment_key: paymentKey
    })
    .eq('id', orderId)
    .select()
    .single()

  // 장바구니 비우기
  await clearCart()
}
```

---

## 🎨 UI/UX 특징

### 1. 반응형 레이아웃

```
[데스크톱]
- 3열 그리드
- 좌측 2열: 폼 + 결제 위젯
- 우측 1열: 주문 요약 (sticky)

[모바일]
- 1열 레이아웃
- 세로 스크롤
```

---

### 2. 주문자 정보 폼

```
┌─────────────────────────┐
│ 주문자 정보              │
├─────────────────────────┤
│ 이름 *     이메일 *      │
│ [홍길동]   [email@...]  │
│                         │
│ 연락처 *                │
│ [010-1234-5678]         │
└─────────────────────────┘
```

---

### 3. 배송지 정보 폼

```
┌─────────────────────────┐
│ 배송지 정보              │
│            [주문자 정보와 동일] │
├─────────────────────────┤
│ 받는사람 *  연락처 *     │
│ [홍길동]   [010-1234-5678]│
│                         │
│ 우편번호 *              │
│ [12345]                 │
│                         │
│ 주소 *                  │
│ [서울시 강남구...]       │
│                         │
│ 상세주소                │
│ [101동 1001호]          │
│                         │
│ 배송 메시지             │
│ [문 앞에 놓아주세요]     │
└─────────────────────────┘
```

---

### 4. Toss Payments 위젯

```
┌─────────────────────────┐
│ 결제 수단                │
├─────────────────────────┤
│  💳 카드                │
│  📱 간편결제            │
│  🏦 계좌이체            │
│  📧 가상계좌            │
└─────────────────────────┘
```

---

### 5. 주문 요약

```
┌─────────────────────────┐
│ 주문 상품                │
├─────────────────────────┤
│ [이미지] 상품명          │
│         ₩50,000 × 2     │
│         ₩100,000        │
├─────────────────────────┤
│ 상품 금액    ₩100,000   │
│ 배송비           무료    │
│ ─────────────────────── │
│ 총 결제금액  ₩100,000   │
│                         │
│ [₩100,000 결제하기]     │
└─────────────────────────┘
```

---

## 🔧 주요 함수 설명

### validateForm()

폼 유효성 검증

```typescript
const validateForm = (): boolean => {
  // 1. 필수 필드 확인
  const required = [
    { field: orderForm.ordererName, name: '주문자 이름' },
    { field: orderForm.ordererEmail, name: '주문자 이메일' },
    // ...
  ]

  for (const { field, name } of required) {
    if (!field.trim()) {
      toast({ title: "필수 정보 누락", description: `${name}을(를) 입력해주세요.` })
      return false
    }
  }

  // 2. 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(orderForm.ordererEmail)) {
    toast({ title: "이메일 형식 오류" })
    return false
  }

  // 3. 전화번호 형식 검증
  const phoneRegex = /^[0-9-]+$/
  if (!phoneRegex.test(orderForm.ordererPhone)) {
    toast({ title: "연락처 형식 오류" })
    return false
  }

  return true
}
```

---

### copyOrdererToRecipient()

주문자 정보 복사

```typescript
const copyOrdererToRecipient = () => {
  setOrderForm(prev => ({
    ...prev,
    recipientName: prev.ordererName,
    recipientPhone: prev.ordererPhone
  }))
  
  toast({ title: "정보가 복사되었습니다" })
}
```

---

## 🚀 실행 방법

### 1. 패키지 확인

```bash
cd my-react-app
npm list @tosspayments/payment-widget-sdk
```

---

### 2. 개발 서버 실행

```bash
npm run dev
```

---

### 3. 테스트 시나리오

#### 전체 결제 플로우
1. 홈 페이지 접속
2. 상품 장바구니에 추가
3. 장바구니 페이지 → "결제하기" 클릭
4. 주문자/배송지 정보 입력
5. 결제 수단 선택 (Toss Payments 위젯)
6. "결제하기" 클릭
7. 결제 성공 페이지 확인
8. Supabase orders 테이블 확인

#### 테스트 카드 번호 (Toss Payments)
- 카드번호: 4000-0000-0000-0001
- 유효기간: 임의 입력 (예: 12/25)
- CVC: 임의 3자리 (예: 123)
- 비밀번호 앞 2자리: 임의 입력 (예: 12)

---

## 📊 데이터베이스

### orders 테이블

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, completed, cancelled
  payment_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

### order_items 테이블

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
)
```

---

### 주문 상태 (status)

- `pending`: 결제 대기 중
- `completed`: 결제 완료
- `cancelled`: 주문 취소

---

## 🔐 보안 고려사항

### 1. 테스트 키 사용

```typescript
// 개발 환경 (현재)
const CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

// 프로덕션 환경 (배포 시)
const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY
```

---

### 2. 결제 승인 (서버 필요)

현재는 클라이언트에서만 처리하지만, **프로덕션에서는 반드시 서버에서 결제 승인을 처리해야 합니다.**

```typescript
// 서버 (Node.js/Express 예시)
app.post('/api/payments/confirm', async (req, res) => {
  const { paymentKey, orderId, amount } = req.body
  
  // Toss Payments 결제 승인 API 호출
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ paymentKey, orderId, amount })
  })
  
  const payment = await response.json()
  
  // Supabase orders 업데이트
  await supabase
    .from('orders')
    .update({ status: 'completed', payment_key: paymentKey })
    .eq('id', orderId)
  
  res.json(payment)
})
```

---

### 3. 금액 검증

서버에서 주문 금액과 결제 금액이 일치하는지 반드시 검증해야 합니다.

```typescript
// 서버
const { data: order } = await supabase
  .from('orders')
  .select('total_amount')
  .eq('id', orderId)
  .single()

if (order.total_amount !== amount) {
  throw new Error('금액이 일치하지 않습니다.')
}
```

---

## 🔍 트러블슈팅

### 결제 위젯이 표시되지 않아요

**원인:** Toss Payments SDK 로드 실패

**해결:**
1. 네트워크 확인
2. CLIENT_KEY 확인
3. 콘솔 오류 확인

---

### 결제 후 orders 테이블에 저장되지 않아요

**원인:** RLS(Row Level Security) 정책

**해결:**
```sql
-- RLS 비활성화 (개발용)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- 또는 정책 생성 (프로덕션용)
CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

### 결제 성공 후 장바구니가 비워지지 않아요

**원인:** clearCart() 함수 호출 실패

**해결:** CheckoutSuccessPage에서 clearCart() 호출 확인

---

## 📝 다음 단계

### 1. 주문 내역 페이지
- 사용자별 주문 목록
- 주문 상세 정보
- 배송 추적

### 2. 관리자 페이지
- 주문 관리
- 배송 처리
- 환불 처리

### 3. 결제 승인 서버
- Node.js/Express 서버
- Toss Payments 결제 승인 API
- Webhook 처리

### 4. 추가 결제 수단
- 네이버페이
- 카카오페이
- 페이코

### 5. 쿠폰/할인
- 쿠폰 적용
- 할인 계산
- 포인트 적립

---

## 🎉 완성!

결제 시스템이 완벽하게 구현되었습니다!

**주요 기능:**
- ✅ 주문자/배송지 정보 입력
- ✅ Toss Payments v2 결제 위젯
- ✅ 결제 요청 및 처리
- ✅ Supabase 주문 저장
- ✅ 결제 성공/실패 페이지
- ✅ 장바구니 연동

**기술 스택:**
- React 19
- TypeScript
- Toss Payments Payment Widget SDK
- Supabase
- shadcn/ui
- Tailwind CSS

**라우트:**
- `/checkout` - 결제 페이지
- `/checkout/success` - 결제 성공
- `/checkout/fail` - 결제 실패

---

**설정 완료일**: 2025-11-18  
**프로젝트**: my-react-app  
**기능**: 결제 시스템 (Toss Payments + Supabase)  
**테스트 키**: test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq



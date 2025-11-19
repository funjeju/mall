import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadPaymentWidget as loadTossPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Package, CreditCard } from 'lucide-react'

// Toss Payments 테스트 클라이언트 키
const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
const CUSTOMER_KEY = 'user-' + crypto.randomUUID()

interface OrderForm {
  // 주문자 정보
  ordererName: string
  ordererEmail: string
  ordererPhone: string
  
  // 배송지 정보
  recipientName: string
  recipientPhone: string
  address: string
  addressDetail: string
  zipCode: string
  deliveryMessage: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { items, getTotalAmount, clearCart } = useCart()
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  const paymentMethodsWidgetRef = useRef<any>(null)
  
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [orderForm, setOrderForm] = useState<OrderForm>({
    ordererName: '',
    ordererEmail: '',
    ordererPhone: '',
    recipientName: '',
    recipientPhone: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    deliveryMessage: ''
  })

  useEffect(() => {
    checkUserAndLoadWidget()
  }, [])

  async function checkUserAndLoadWidget() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "결제하려면 먼저 로그인해주세요.",
          variant: "destructive"
        })
        navigate('/login')
        return
      }

      if (items.length === 0) {
        toast({
          title: "장바구니가 비어있습니다",
          description: "상품을 먼저 추가해주세요.",
          variant: "destructive"
        })
        navigate('/cart')
        return
      }

      setUser(user)
      
      // 사용자 정보로 폼 초기화
      setOrderForm(prev => ({
        ...prev,
        ordererEmail: user.email || '',
        ordererName: user.user_metadata?.name || ''
      }))

      // Toss Payments 위젯 로드
      await loadPaymentWidget()
      
      setIsLoading(false)
    } catch (error) {
      console.error('초기화 오류:', error)
      toast({
        title: "오류 발생",
        description: "페이지를 불러오지 못했습니다.",
        variant: "destructive"
      })
    }
  }

  async function loadPaymentWidget() {
    try {
      const paymentWidget = await loadTossPaymentWidget(CLIENT_KEY, CUSTOMER_KEY)
      paymentWidgetRef.current = paymentWidget

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        '#payment-widget',
        { value: getTotalAmount() },
        { variantKey: 'DEFAULT' }
      )
      
      paymentMethodsWidgetRef.current = paymentMethodsWidget
    } catch (error) {
      console.error('결제 위젯 로드 오류:', error)
      throw error
    }
  }

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }))
  }

  const copyOrdererToRecipient = () => {
    setOrderForm(prev => ({
      ...prev,
      recipientName: prev.ordererName,
      recipientPhone: prev.ordererPhone
    }))
    toast({
      title: "정보가 복사되었습니다",
      description: "주문자 정보를 받는 사람 정보로 복사했습니다."
    })
  }

  const validateForm = (): boolean => {
    const required = [
      { field: orderForm.ordererName, name: '주문자 이름' },
      { field: orderForm.ordererEmail, name: '주문자 이메일' },
      { field: orderForm.ordererPhone, name: '주문자 연락처' },
      { field: orderForm.recipientName, name: '받는 사람 이름' },
      { field: orderForm.recipientPhone, name: '받는 사람 연락처' },
      { field: orderForm.address, name: '주소' },
      { field: orderForm.zipCode, name: '우편번호' }
    ]

    for (const { field, name } of required) {
      if (!field.trim()) {
        toast({
          title: "필수 정보 누락",
          description: `${name}을(를) 입력해주세요.`,
          variant: "destructive"
        })
        return false
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(orderForm.ordererEmail)) {
      toast({
        title: "이메일 형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
        variant: "destructive"
      })
      return false
    }

    // 전화번호 형식 검증 (숫자와 하이픈만)
    const phoneRegex = /^[0-9-]+$/
    if (!phoneRegex.test(orderForm.ordererPhone) || !phoneRegex.test(orderForm.recipientPhone)) {
      toast({
        title: "연락처 형식 오류",
        description: "올바른 전화번호를 입력해주세요. (예: 010-1234-5678)",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) return
    if (!paymentWidgetRef.current) {
      toast({
        title: "오류",
        description: "결제 위젯을 불러오지 못했습니다.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // 1. Supabase에 주문 정보 먼저 저장 (결제 전)
      const orderId = await createOrder('pending')
      
      // 2. Toss Payments 결제 요청
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
    } catch (error: any) {
      console.error('결제 오류:', error)
      toast({
        title: "결제 실패",
        description: error.message || "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      })
      setIsProcessing(false)
    }
  }

  const createOrder = async (status: string): Promise<string> => {
    try {
      // 1. orders 테이블에 주문 생성
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalAmount(),
          status,
          // 주문자 및 배송지 정보를 JSON으로 저장할 수도 있음
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. order_items 테이블에 주문 상품 저장
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 3. 배송 정보를 별도 테이블에 저장 (선택사항 - 테이블이 있다면)
      // 여기서는 orders 테이블에 JSON 컬럼으로 저장하는 방법도 있음

      return order.id
    } catch (error) {
      console.error('주문 생성 오류:', error)
      throw new Error('주문 정보를 저장하지 못했습니다.')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">결제 페이지 준비 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/cart')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        장바구니로 돌아가기
      </Button>

      <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 주문 정보 입력 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                주문자 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ordererName">이름 *</Label>
                  <Input
                    id="ordererName"
                    value={orderForm.ordererName}
                    onChange={(e) => handleInputChange('ordererName', e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ordererEmail">이메일 *</Label>
                  <Input
                    id="ordererEmail"
                    type="email"
                    value={orderForm.ordererEmail}
                    onChange={(e) => handleInputChange('ordererEmail', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordererPhone">연락처 *</Label>
                <Input
                  id="ordererPhone"
                  value={orderForm.ordererPhone}
                  onChange={(e) => handleInputChange('ordererPhone', e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>
            </CardContent>
          </Card>

          {/* 배송지 정보 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>배송지 정보</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyOrdererToRecipient}
                >
                  주문자 정보와 동일
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">받는 사람 *</Label>
                  <Input
                    id="recipientName"
                    value={orderForm.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientPhone">연락처 *</Label>
                  <Input
                    id="recipientPhone"
                    value={orderForm.recipientPhone}
                    onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">우편번호 *</Label>
                <Input
                  id="zipCode"
                  value={orderForm.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소 *</Label>
                <Input
                  id="address"
                  value={orderForm.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="서울시 강남구 테헤란로 123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressDetail">상세주소</Label>
                <Input
                  id="addressDetail"
                  value={orderForm.addressDetail}
                  onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                  placeholder="101동 1001호"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryMessage">배송 메시지</Label>
                <Input
                  id="deliveryMessage"
                  value={orderForm.deliveryMessage}
                  onChange={(e) => handleInputChange('deliveryMessage', e.target.value)}
                  placeholder="문 앞에 놓아주세요"
                />
              </div>
            </CardContent>
          </Card>

          {/* 결제 위젯 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                결제 수단
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="payment-widget" />
            </CardContent>
          </Card>
        </div>

        {/* 우측: 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 상품 목록 */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* 금액 정보 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span>무료</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-primary">{formatPrice(getTotalAmount())}</span>
              </div>

              {/* 결제 버튼 */}
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    결제 처리 중...
                  </>
                ) : (
                  `${formatPrice(getTotalAmount())} 결제하기`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                결제 진행 시 개인정보 처리방침 및 이용약관에 동의한 것으로 간주됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


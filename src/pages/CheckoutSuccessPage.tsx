import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/contexts/CartContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Package, Home } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderInfo, setOrderInfo] = useState<any>(null)

  useEffect(() => {
    processPaymentSuccess()
  }, [])

  async function processPaymentSuccess() {
    try {
      // URL에서 결제 정보 추출
      const orderId = searchParams.get('orderId')
      const paymentKey = searchParams.get('paymentKey')
      const amount = searchParams.get('amount')

      if (!orderId || !paymentKey || !amount) {
        throw new Error('결제 정보가 누락되었습니다.')
      }

      // Toss Payments 결제 승인 API 호출 (서버에서 처리해야 함)
      // 여기서는 간단히 Supabase orders 테이블 업데이트만 수행
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_key: paymentKey
        })
        .eq('id', orderId)
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .single()

      if (updateError) throw updateError

      setOrderInfo(order)

      // 장바구니 비우기
      await clearCart()

      toast({
        title: "결제 완료!",
        description: "주문이 성공적으로 완료되었습니다."
      })

      setIsProcessing(false)
    } catch (error: any) {
      console.error('결제 처리 오류:', error)
      toast({
        title: "결제 처리 실패",
        description: error.message || "결제 정보를 처리하지 못했습니다.",
        variant: "destructive"
      })
      navigate('/checkout/fail')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">결제 정보 처리 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">결제가 완료되었습니다!</h1>
        <p className="text-muted-foreground">
          주문해주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.
        </p>
      </div>

      {orderInfo && (
        <div className="space-y-6">
          {/* 주문 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>주문 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono text-sm">{orderInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문일시</span>
                <span>{formatDate(orderInfo.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 상태</span>
                <span className="text-green-600 font-semibold">결제 완료</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>결제 금액</span>
                <span className="text-primary">{formatPrice(orderInfo.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 주문 상품 */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderInfo.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
                      {item.products?.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}개
                      </p>
                      <p className="font-semibold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 안내 메시지 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-blue-900">배송 안내</p>
                <ul className="space-y-1 text-blue-800 list-disc list-inside">
                  <li>평일 오후 2시 이전 주문 시 당일 발송됩니다.</li>
                  <li>배송 기간은 2-3일 정도 소요됩니다.</li>
                  <li>배송 관련 문의는 고객센터로 연락주세요.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/orders')}
            >
              <Package className="w-4 h-4 mr-2" />
              주문 내역 보기
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로 가기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}



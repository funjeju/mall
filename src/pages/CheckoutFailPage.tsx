import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Home, ShoppingCart } from 'lucide-react'

export function CheckoutFailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">결제에 실패했습니다</h1>
        <p className="text-muted-foreground">
          결제 처리 중 문제가 발생했습니다.
        </p>
      </div>

      {(errorCode || errorMessage) && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {errorCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-900 font-semibold">오류 코드:</span>
                  <span className="text-red-800 font-mono">{errorCode}</span>
                </div>
              )}
              {errorMessage && (
                <div className="text-sm">
                  <span className="text-red-900 font-semibold">오류 메시지:</span>
                  <p className="text-red-800 mt-1">{errorMessage}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <p className="font-semibold">다음 사항을 확인해주세요:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>카드 정보가 정확한지 확인해주세요</li>
              <li>카드 한도가 충분한지 확인해주세요</li>
              <li>인터넷 연결이 안정적인지 확인해주세요</li>
              <li>결제 비밀번호를 정확히 입력했는지 확인해주세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button
          className="w-full"
          size="lg"
          onClick={() => navigate('/checkout')}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          다시 결제하기
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/cart')}
        >
          장바구니로 돌아가기
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/')}
        >
          <Home className="w-4 h-4 mr-2" />
          홈으로 가기
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-6">
        문제가 계속되면 고객센터(1234-5678)로 문의해주세요.
      </p>
    </div>
  )
}



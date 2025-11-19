import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function CartPage() {
  const { items, isLoading, removeFromCart, updateQuantity, getTotalAmount, getTotalItems } = useCart()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }

  const handleQuantityChange = async (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity >= 1) {
      await updateQuantity(productId, newQuantity)
    }
  }

  const handleRemove = async (productId: string, productName: string) => {
    await removeFromCart(productId)
    toast({
      title: "상품 삭제",
      description: `${productName}이(가) 장바구니에서 삭제되었습니다.`
    })
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "결제하려면 먼저 로그인해주세요.",
        variant: "destructive"
      })
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast({
        title: "장바구니가 비어있습니다",
        description: "상품을 추가해주세요.",
        variant: "destructive"
      })
      return
    }

    // 결제 페이지로 이동
    navigate('/checkout')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">장바구니 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-bold">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground">상품을 추가해보세요!</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-muted-foreground">
          총 {getTotalItems()}개의 상품이 있습니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        {item.product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.product.description}
                          </p>
                        )}
                        <p className="text-lg font-bold mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.product.id, item.product.name)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* 수량 조절 */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          if (value >= 1) {
                            updateQuantity(item.product.id, value)
                          }
                        }}
                        className="h-8 w-16 text-center"
                        min="1"
                      />
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <span className="text-sm text-muted-foreground ml-2">
                        (재고: {item.product.stock}개)
                      </span>

                      {/* 소계 */}
                      <span className="ml-auto font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{formatPrice(getTotalAmount())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span>무료</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>총 결제금액</span>
                <span className="text-primary">{formatPrice(getTotalAmount())}</span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• {getTotalItems()}개 상품</p>
                <p>• 50,000원 이상 구매 시 무료배송</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
              >
                {formatPrice(getTotalAmount())} 결제하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 쇼핑 계속하기 버튼 */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full mt-4"
          >
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    </div>
  )
}


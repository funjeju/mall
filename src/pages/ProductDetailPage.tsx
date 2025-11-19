import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Product, isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Truck, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/CartContext'
import { getProductById } from '@/data/mockProducts'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id])

  async function loadProduct(productId: string) {
    try {
      // Supabase가 설정되어 있으면 실제 데이터 로드
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (error) {
          console.warn('Supabase 데이터 로드 실패, Mock 데이터 사용:', error)
          const mockProduct = getProductById(productId)
          setProduct(mockProduct || null)
        } else {
          setProduct(data)
        }
      } else {
        // Supabase 미설정 시 Mock 데이터 사용
        console.log('Supabase 미설정, Mock 데이터 사용')
        const mockProduct = getProductById(productId)
        setProduct(mockProduct || null)
      }
    } catch (error) {
      console.error('상품 로드 오류, Mock 데이터 사용:', error)
      const mockProduct = getProductById(productId)
      setProduct(mockProduct || null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      await addToCart(product, quantity)
      toast({
        title: '장바구니에 추가되었습니다!',
        description: `${product.name} ${quantity}개가 장바구니에 담겼습니다.`,
      })
      
      // 장바구니 페이지로 이동할지 물어보기 (선택사항)
      // navigate('/cart')
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '장바구니에 추가하지 못했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">로딩 중...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">상품을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 이미지 */}
          <Card className="overflow-hidden">
            <div className="relative w-full h-[400px] md:h-[600px] bg-gray-100">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge className="absolute top-4 right-4 bg-orange-500 text-lg px-4 py-2">
                  재고 {product.stock}개
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-lg px-4 py-2">
                  품절
                </Badge>
              )}
            </div>
          </Card>

          {/* 상품 정보 */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                {product.price.toLocaleString()}원
              </p>
            </div>

            <hr className="my-4 border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold mb-2">상품 설명</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* 수량 선택 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">수량</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  재고: {product.stock}개
                </p>
              </div>
            </div>

            {/* 총 금액 */}
            <Card className="bg-gray-100">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">총 금액</span>
                  <span className="text-3xl font-bold text-primary">
                    {(product.price * quantity).toLocaleString()}원
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ({product.price.toLocaleString()}원 × {quantity}개)
                </p>
              </CardContent>
            </Card>

            {/* 구매 버튼 */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                장바구니
              </Button>
              <Button
                className="flex-1"
                size="lg"
                variant="outline"
                disabled={product.stock === 0}
              >
                바로 구매
              </Button>
            </div>

            {/* 배송 정보 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">무료 배송</h4>
                    <p className="text-sm text-muted-foreground">
                      5만원 이상 구매 시 전국 무료 배송
                    </p>
                  </div>
                </div>

                <hr className="my-4 border-gray-200" />

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">빠른 배송</h4>
                    <p className="text-sm text-muted-foreground">
                      평일 오후 2시 이전 주문 시 당일 발송
                    </p>
                  </div>
                </div>

                <hr className="my-4 border-gray-200" />

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">안전한 결제</h4>
                    <p className="text-sm text-muted-foreground">
                      SSL 보안 결제 시스템 적용
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


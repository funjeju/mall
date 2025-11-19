import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Package } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { supabase, Product } from '@/lib/supabase'

export function ProductList() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(['전체'])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])

      // 카테고리 추출
      const uniqueCategories = ['전체', ...new Set(data?.map(p => p.category).filter(Boolean) as string[])]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('상품 로드 오류:', error)
      toast({
        title: "오류 발생",
        description: "상품을 불러오지 못했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredProducts = selectedCategory === '전체'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    
    try {
      await addToCart(product, 1)
      toast({
        title: "장바구니에 추가되었습니다!",
        description: `${product.name}이(가) 장바구니에 담겼습니다.`
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "장바구니에 추가하지 못했습니다.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">상품을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">인기 상품</h2>
          <p className="text-muted-foreground">
            다양한 카테고리의 상품을 만나보세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* 상품 이미지 */}
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    재고 {product.stock}개
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    품절
                  </Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {product.price.toLocaleString()}원
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/products/${product.id}`)
                  }}
                >
                  상세보기
                </Button>
                <Button
                  disabled={product.stock === 0}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {product.stock === 0 ? '품절' : '담기'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 상품이 없을 때 */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              해당 카테고리에 상품이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


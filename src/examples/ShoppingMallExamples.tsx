import { useEffect, useState } from 'react'
import { supabase, Product, Cart } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// 1. 상품 목록 조회 예제
export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('상품 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>로딩 중...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold mt-2">
              {product.price.toLocaleString()}원
            </p>
            <p className="text-sm text-muted-foreground">
              재고: {product.stock}개
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">장바구니 추가</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// 2. 카테고리별 상품 조회 예제
export function ProductsByCategory() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState('전자기기')

  useEffect(() => {
    fetchProductsByCategory(category)
  }, [category])

  async function fetchProductsByCategory(cat: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', cat)

    if (error) {
      console.error('카테고리별 조회 오류:', error)
    } else {
      setProducts(data || [])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">카테고리: {category}</h2>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3. 장바구니에 상품 추가 예제
export function AddToCart({ productId, userId }: { productId: string; userId: string }) {
  const [quantity, setQuantity] = useState(1)

  async function addToCart() {
    try {
      // 이미 장바구니에 있는지 확인
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (existing) {
        // 이미 있으면 수량 업데이트
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)

        if (error) throw error
        alert('장바구니 수량이 업데이트되었습니다!')
      } else {
        // 없으면 새로 추가
        const { error } = await supabase
          .from('cart')
          .insert([{
            user_id: userId,
            product_id: productId,
            quantity: quantity
          }])

        if (error) throw error
        alert('장바구니에 추가되었습니다!')
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error)
      alert('장바구니 추가 실패')
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        className="w-20"
      />
      <Button onClick={addToCart}>장바구니 추가</Button>
    </div>
  )
}

// 4. 장바구니 조회 예제
export function CartList({ userId }: { userId: string }) {
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    fetchCart()
  }, [userId])

  async function fetchCart() {
    const { data, error } = await supabase
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
      .eq('user_id', userId)

    if (error) {
      console.error('장바구니 조회 오류:', error)
    } else {
      setCartItems(data || [])
    }
  }

  async function removeFromCart(cartId: string) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId)

    if (error) {
      console.error('삭제 오류:', error)
    } else {
      fetchCart() // 다시 조회
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity
  }, 0)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.products?.name}</h3>
                    <p>수량: {item.quantity}</p>
                    <p className="font-semibold">
                      {((item.products?.price || 0) * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-2xl font-bold mt-4">
            총액: {totalAmount.toLocaleString()}원
          </div>
        </>
      )}
    </div>
  )
}

// 5. 주문 생성 예제
export async function createOrder(userId: string, cartItems: Cart[]) {
  try {
    // 장바구니 상품 정보 조회
    const productIds = cartItems.map(item => item.product_id)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (!products) throw new Error('상품 정보를 찾을 수 없습니다')

    // 총 금액 계산
    const totalAmount = cartItems.reduce((sum, cartItem) => {
      const product = products.find(p => p.id === cartItem.product_id)
      return sum + (product?.price || 0) * cartItem.quantity
    }, 0)

    // 주문 생성
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending'
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // 주문 상품 생성
    const orderItems = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.product_id)
      return {
        order_id: order.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: product?.price || 0
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // 장바구니 비우기
    const { error: clearError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)

    if (clearError) throw clearError

    // 재고 업데이트
    for (const cartItem of cartItems) {
      const product = products.find(p => p.id === cartItem.product_id)
      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - cartItem.quantity })
          .eq('id', cartItem.product_id)
      }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('주문 생성 오류:', error)
    return { success: false, error }
  }
}

// 6. 주문 내역 조회 예제
export function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetchOrders()
  }, [userId])

  async function fetchOrders() {
    const { data, error } = await supabase
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('주문 내역 조회 오류:', error)
    } else {
      setOrders(data || [])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">주문 내역</h2>
      {orders.map((order) => (
        <Card key={order.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              주문 번호: {order.id.slice(0, 8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.products?.name}</span>
                  <span>
                    {item.quantity}개 × {item.price.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>총액</span>
                <span>{order.total_amount.toLocaleString()}원</span>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


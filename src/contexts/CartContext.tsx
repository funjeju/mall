import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/supabase'

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalAmount: () => number
  getTotalItems: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// 로컬스토리지 키
const CART_STORAGE_KEY = 'shopping_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // 사용자 인증 상태 확인
  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // 로그인 시: 로컬스토리지의 장바구니를 Supabase로 동기화
        await syncLocalToSupabase(session.user.id)
        await loadCartFromSupabase(session.user.id)
      } else {
        // 로그아웃 시: 로컬스토리지에서 로드
        loadCartFromLocal()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await loadCartFromSupabase(user.id)
      } else {
        loadCartFromLocal()
      }
    } catch (error) {
      console.error('사용자 확인 오류:', error)
      loadCartFromLocal()
    }
    setIsLoading(false)
  }

  // 로컬스토리지에서 장바구니 로드
  function loadCartFromLocal() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('로컬스토리지 로드 오류:', error)
      setItems([])
    }
  }

  // Supabase에서 장바구니 로드
  async function loadCartFromSupabase(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            description,
            price,
            image_url,
            stock,
            category,
            created_at
          )
        `)
        .eq('user_id', userId)

      if (error) throw error

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity
      }))

      setItems(cartItems)
      
      // Supabase 데이터를 로컬스토리지에도 저장
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Supabase 장바구니 로드 오류:', error)
    }
  }

  // 로컬스토리지 장바구니를 Supabase로 동기화
  async function syncLocalToSupabase(userId: string) {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (!stored) return

      const localItems: CartItem[] = JSON.parse(stored)
      
      // 각 아이템을 Supabase에 추가
      for (const item of localItems) {
        await supabase
          .from('cart')
          .upsert({
            user_id: userId,
            product_id: item.product.id,
            quantity: item.quantity
          }, {
            onConflict: 'user_id,product_id'
          })
      }
    } catch (error) {
      console.error('로컬 → Supabase 동기화 오류:', error)
    }
  }

  // 로컬스토리지에 저장
  function saveToLocal(cartItems: CartItem[]) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }

  // 장바구니에 상품 추가
  async function addToCart(product: Product, quantity: number = 1) {
    const existingItemIndex = items.findIndex(item => item.product.id === product.id)

    let newItems: CartItem[]

    if (existingItemIndex >= 0) {
      // 이미 있는 상품이면 수량만 증가
      newItems = [...items]
      newItems[existingItemIndex].quantity += quantity
    } else {
      // 새 상품 추가
      newItems = [...items, { id: crypto.randomUUID(), product, quantity }]
    }

    setItems(newItems)
    saveToLocal(newItems)

    // 로그인 상태면 Supabase에도 저장
    if (user) {
      try {
        await supabase
          .from('cart')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: existingItemIndex >= 0 
              ? items[existingItemIndex].quantity + quantity 
              : quantity
          }, {
            onConflict: 'user_id,product_id'
          })
      } catch (error) {
        console.error('Supabase 장바구니 추가 오류:', error)
      }
    }
  }

  // 장바구니에서 상품 삭제
  async function removeFromCart(productId: string) {
    const newItems = items.filter(item => item.product.id !== productId)
    setItems(newItems)
    saveToLocal(newItems)

    // 로그인 상태면 Supabase에서도 삭제
    if (user) {
      try {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
      } catch (error) {
        console.error('Supabase 장바구니 삭제 오류:', error)
      }
    }
  }

  // 수량 변경
  async function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    const newItems = items.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    )

    setItems(newItems)
    saveToLocal(newItems)

    // 로그인 상태면 Supabase 업데이트
    if (user) {
      try {
        await supabase
          .from('cart')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId)
      } catch (error) {
        console.error('Supabase 수량 변경 오류:', error)
      }
    }
  }

  // 장바구니 전체 삭제
  async function clearCart() {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)

    if (user) {
      try {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
      } catch (error) {
        console.error('Supabase 장바구니 전체 삭제 오류:', error)
      }
    }
  }

  // 총 금액 계산
  function getTotalAmount(): number {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  // 총 상품 개수 계산
  function getTotalItems(): number {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  // 장바구니 새로고침
  async function refreshCart() {
    if (user) {
      await loadCartFromSupabase(user.id)
    } else {
      loadCartFromLocal()
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalAmount,
        getTotalItems,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart는 CartProvider 내에서 사용해야 합니다')
  }
  return context
}



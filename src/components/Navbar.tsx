import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, Package, LogOut, UserCircle } from 'lucide-react'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { getTotalItems } = useCart()

  useEffect(() => {
    // 현재 사용자 확인
    checkUser()
    
    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('사용자 확인 오류:', error)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    navigate('/login')
  }

  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const cartCount = getTotalItems()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 좌측: 로고 */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xl font-bold">S</span>
          </div>
          <span className="text-xl font-bold">쇼핑몰</span>
        </Link>

        {/* 우측: 인증 상태별 UI */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* 장바구니 아이콘 + 개수 뱃지 */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge 
                      className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* 프로필 드롭다운 */}
              <DropdownMenu>
                <DropdownMenuTrigger 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="focus:outline-none"
                >
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-muted hover:border-primary transition-colors">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent open={dropdownOpen}>
                  {/* 사용자 정보 */}
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.user_metadata?.name || '사용자'}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  {/* 내정보 */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate('/profile')
                      setDropdownOpen(false)
                    }}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>내정보</span>
                  </DropdownMenuItem>

                  {/* 주문 내역 */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate('/orders')
                      setDropdownOpen(false)
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>주문 내역</span>
                  </DropdownMenuItem>

                  {/* 장바구니 */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate('/cart')
                      setDropdownOpen(false)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>장바구니</span>
                    {cartCount > 0 && (
                      <Badge className="ml-auto" variant="secondary">
                        {cartCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* 로그아웃 */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* 로그인 전: 로그인 / 회원가입 버튼 */}
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
              <Button
                onClick={() => navigate('/signup')}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}


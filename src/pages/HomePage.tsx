import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { HeroSection } from '@/components/HeroSection'
import { ProductList } from '@/components/ProductList'

export function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <HeroSection />
      
      {/* 상품 목록 섹션 */}
      <ProductList />
      
      {/* 사용자 정보 섹션 */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">회원 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <p className="text-lg">
                    환영합니다, <span className="font-bold">{user.email}</span>님! 🎉
                  </p>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      사용자 ID: {user.id}
                    </p>
                    <p className="text-muted-foreground">
                      가입일: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="pt-4 space-x-2">
                    <Button onClick={handleLogout} variant="outline">
                      로그아웃
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg">로그인하고 더 많은 혜택을 누리세요!</p>
                  <div className="pt-4 space-x-2">
                    <Button onClick={() => navigate('/login')}>
                      로그인
                    </Button>
                    <Button onClick={() => navigate('/signup')} variant="outline">
                      회원가입
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


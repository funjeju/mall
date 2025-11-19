import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "이메일과 비밀번호를 입력해주세요"
      })
      return
    }
    
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        // 로그인 성공
        toast({
          title: "로그인 성공! 🎉",
          description: `환영합니다, ${data.user.email}님!`
        })
        
        // 로그인 상태 유지 설정
        if (rememberMe) {
          // 세션을 로컬 스토리지에 저장 (기본값)
          localStorage.setItem('supabase.auth.remember', 'true')
        }
        
        // 이전 페이지 또는 홈으로 리다이렉트
        const from = sessionStorage.getItem('loginRedirect') || '/'
        sessionStorage.removeItem('loginRedirect')
        navigate(from)
      }
    } catch (error: any) {
      console.error('로그인 오류:', error)
      
      let errorMessage = '로그인 중 오류가 발생했습니다'
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.'
      }
      
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            로그인
          </CardTitle>
          <CardDescription className="text-center">
            계정에 로그인하여 쇼핑을 계속하세요
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            
            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            
            {/* 로그인 상태 유지 체크박스 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label 
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                로그인 상태 유지
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2">로그인 중...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                '로그인'
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                계정이 없으신가요?{' '}
              </span>
              <a 
                href="/signup" 
                className="text-primary font-medium hover:underline"
              >
                회원가입
              </a>
            </div>
            
            <div className="text-center">
              <a 
                href="/forgot-password" 
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


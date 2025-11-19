import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  name?: string
  password?: string
  confirmPassword?: string
}

export function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  // 이메일 유효성 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 비밀번호 유효성 검증
  const validatePassword = (password: string): boolean => {
    // 최소 8자, 대소문자, 숫자 포함
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber
  }

  // 실시간 유효성 검증
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 실시간 에러 검증
    const newErrors: FormErrors = { ...errors }
    
    if (field === 'email') {
      if (value && !validateEmail(value)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다'
      } else {
        delete newErrors.email
      }
    }
    
    if (field === 'name') {
      if (value && value.length < 2) {
        newErrors.name = '이름은 최소 2자 이상이어야 합니다'
      } else {
        delete newErrors.name
      }
    }
    
    if (field === 'password') {
      if (value && !validatePassword(value)) {
        newErrors.password = '비밀번호는 최소 8자, 대소문자와 숫자를 포함해야 합니다'
      } else {
        delete newErrors.password
      }
      
      // 비밀번호 확인 검증
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      } else if (formData.confirmPassword) {
        delete newErrors.confirmPassword
      }
    }
    
    if (field === 'confirmPassword') {
      if (value && value !== formData.password) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      } else {
        delete newErrors.confirmPassword
      }
    }
    
    setErrors(newErrors)
  }

  // 폼 전체 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    }
    
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요'
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 최소 2자 이상이어야 합니다'
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 최소 8자, 대소문자와 숫자를 포함해야 합니다'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 회원가입 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 필드를 올바르게 입력해주세요"
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Supabase Auth 회원가입
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        // 성공 메시지
        toast({
          title: "회원가입 성공! 🎉",
          description: "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.",
          duration: 5000
        })
        
        // 폼 초기화
        setFormData({
          email: '',
          name: '',
          password: '',
          confirmPassword: ''
        })
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다"
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
            회원가입
          </CardTitle>
          <CardDescription className="text-center">
            계정을 생성하여 쇼핑을 시작하세요
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                최소 8자, 대소문자 및 숫자 포함
              </p>
            </div>
            
            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? (
                <>
                  <span className="mr-2">가입 중...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                '회원가입'
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                이미 계정이 있으신가요?{' '}
              </span>
              <a 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                로그인
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


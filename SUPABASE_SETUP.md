# Supabase 설정 완료! 🎉

## ✅ 완료된 작업

1. **Supabase 클라이언트 설치**
   - ✅ `@supabase/supabase-js` 패키지 설치 완료
   - ✅ `src/lib/supabase.js` 클라이언트 설정 파일 생성

2. **프로젝트 정보**
   - 🌐 Supabase URL: `https://yeqyycvmtxkxhxsbjmkp.supabase.co`
   - 🔑 Anon Key: 자동 설정됨

## 🚀 다음 단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 **수동으로** 만들고 다음 내용을 붙여넣으세요:

```env
VITE_SUPABASE_URL=https://yeqyycvmtxkxhxsbjmkp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcXl5Y3ZtdHhreGh4c2JqbWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTkyNDIsImV4cCI6MjA3OTAzNTI0Mn0.8LtJP7H8OvJ2f0l5vs-INOrBOfewhZf3vQ3YYQ4c5RE
```

> ⚠️ **보안 주의**: `.env.local` 파일은 이미 `.gitignore`에 포함되어 있어 Git에 업로드되지 않습니다.

## 📝 사용 예제

### 1. 기본 데이터 조회

```jsx
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>로딩 중...</div>

  return (
    <div>
      <h2>할 일 목록</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2. 데이터 추가

```jsx
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function AddTodo() {
  const [title, setTitle] = useState('')

  async function addTodo(e) {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, completed: false }])
      .select()

    if (error) {
      console.error('Error adding todo:', error.message)
    } else {
      console.log('Todo added:', data)
      setTitle('')
    }
  }

  return (
    <form onSubmit={addTodo} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 할 일"
      />
      <Button type="submit">추가</Button>
    </form>
  )
}
```

### 3. 실시간 구독

```jsx
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

function RealtimeTodos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    // 초기 데이터 로드
    fetchTodos()

    // 실시간 구독
    const channel = supabase
      .channel('todos_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          console.log('Change received!', payload)
          fetchTodos() // 변경사항 발생 시 다시 로드
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchTodos() {
    const { data } = await supabase.from('todos').select('*')
    setTodos(data || [])
  }

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  )
}
```

### 4. 인증 (로그인)

```jsx
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
    } else {
      console.log('Logged in:', data)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <Button type="submit">로그인</Button>
    </form>
  )
}
```

### 5. 현재 사용자 확인

```jsx
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) {
    return <div>로그인이 필요합니다</div>
  }

  return (
    <div>
      <p>안녕하세요, {user.email}님!</p>
      <Button onClick={() => supabase.auth.signOut()}>
        로그아웃
      </Button>
    </div>
  )
}
```

## 🔧 유용한 MCP 명령어

MCP가 연결되어 있으므로 다음과 같은 작업을 할 수 있습니다:

```bash
# 테이블 목록 조회
mcp_supabase_list_tables

# SQL 실행
mcp_supabase_execute_sql

# 마이그레이션 적용
mcp_supabase_apply_migration
```

## 📚 추가 패키지 (선택사항)

### Supabase Auth UI (로그인 UI 컴포넌트)

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

사용 예제:

```jsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

function AuthComponent() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
    />
  )
}
```

## ⚠️ 중요 사항

1. **환경 변수 사용**: 항상 `import.meta.env`를 통해 환경 변수 접근
2. **에러 처리**: Supabase 응답에서 항상 `error` 체크
3. **보안**: Anon Key는 공개해도 되지만, Service Key는 절대 클라이언트에서 사용 금지

## 🎯 다음 작업

1. ✅ `.env.local` 파일 생성
2. 개발 서버 재시작: `npm run dev`
3. Supabase 대시보드에서 테이블 생성
4. 위의 예제 코드로 테스트

---

**설정 완료일**: 2025-11-18
**Supabase 프로젝트**: yeqyycvmtxkxhxsbjmkp


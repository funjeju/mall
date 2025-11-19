# AGENTS.md - 프로젝트 개발 가이드라인

이 문서는 AI 에이전트 및 개발자가 이 프로젝트에서 작업할 때 따라야 할 규칙과 가이드라인을 정의합니다.

## 프로젝트 개요

- **프레임워크**: React 19 + Vite
- **UI 라이브러리**: shadcn/ui
- **스타일링**: Tailwind CSS (shadcn/ui 필요)
- **언어**: JavaScript (JSX)

## 핵심 규칙

### 1. shadcn/ui를 적극 활용한 디자인

모든 UI 컴포넌트는 가능한 한 shadcn/ui 컴포넌트를 사용하여 구축해야 합니다.

#### shadcn/ui 초기 설정 (첫 사용 시)

```bash
# Tailwind CSS 및 필요한 의존성 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui 초기화
npx shadcn@latest init
```

초기화 시 다음 옵션을 선택:
- Style: Default
- Base color: Slate (또는 프로젝트에 맞는 색상)
- CSS variables: Yes

#### Vite 설정 업데이트 (path alias)

`vite.config.js`에 다음 설정 추가:

```javascript
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### 2. shadcn 컴포넌트 추가 방법

새로운 UI 요소가 필요할 때는 **반드시 터미널 명령어**를 통해 shadcn 컴포넌트를 추가합니다.

#### 기본 명령어 형식

```bash
npx shadcn@latest add [component-name]
```

#### 자주 사용하는 컴포넌트 예시

```bash
# 버튼 컴포넌트
npx shadcn@latest add button

# 카드 컴포넌트
npx shadcn@latest add card

# 입력 폼 컴포넌트
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# 다이얼로그 및 모달
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add sheet

# 네비게이션
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add tabs

# 데이터 표시
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar

# 피드백
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add skeleton

# 레이아웃
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add accordion

# 드롭다운 및 메뉴
npx shadcn@latest add dropdown-menu
npx shadcn@latest add context-menu
npx shadcn@latest add menubar

# 날짜 및 시간
npx shadcn@latest add calendar
npx shadcn@latest add date-picker

# 기타
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add slider
npx shadcn@latest add switch
```

#### 여러 컴포넌트 한 번에 추가

```bash
npx shadcn@latest add button card input label
```

### 3. 디자인 및 레이아웃 가이드라인

#### 3.1 컴포넌트 사용 원칙

1. **커스텀 컴포넌트 최소화**: 기본 HTML 요소 대신 항상 shadcn/ui 컴포넌트를 우선 사용
2. **일관성 유지**: 동일한 UI 패턴에는 동일한 shadcn 컴포넌트 사용
3. **접근성 고려**: shadcn/ui는 접근성이 내장되어 있으므로 이를 활용

#### 3.2 레이아웃 구조

```jsx
// ✅ 좋은 예시 - shadcn Card 사용
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>제목</CardTitle>
      </CardHeader>
      <CardContent>
        <p>내용</p>
        <Button>액션</Button>
      </CardContent>
    </Card>
  )
}

// ❌ 나쁜 예시 - 기본 HTML 사용
function MyComponent() {
  return (
    <div className="card">
      <h2>제목</h2>
      <p>내용</p>
      <button>액션</button>
    </div>
  )
}
```

#### 3.3 스타일링 규칙

1. **Tailwind CSS 클래스 사용**: shadcn/ui는 Tailwind를 기반으로 하므로 스타일링에 Tailwind 유틸리티 클래스 사용
2. **커스텀 CSS 최소화**: `globals.css`나 별도 CSS 파일 대신 Tailwind 클래스 우선
3. **테마 변수 활용**: CSS 변수를 통한 다크 모드 및 테마 커스터마이징

```css
/* src/index.css 또는 globals.css에서 테마 변수 정의 */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* shadcn/ui init 시 자동 생성됨 */
  }
}
```

#### 3.4 반응형 디자인

Tailwind의 반응형 접두사를 사용:

```jsx
<Card className="w-full md:w-1/2 lg:w-1/3">
  <CardContent className="p-4 md:p-6 lg:p-8">
    {/* 콘텐츠 */}
  </CardContent>
</Card>
```

### 4. 프로젝트 구조

```
my-react-app/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn 컴포넌트 (자동 생성)
│   ├── lib/
│   │   └── utils.js      # shadcn 유틸리티 (자동 생성)
│   ├── pages/            # 페이지 컴포넌트
│   ├── features/         # 기능별 컴포넌트
│   ├── hooks/            # 커스텀 훅
│   ├── App.jsx
│   └── main.jsx
├── components.json       # shadcn 설정
├── tailwind.config.js
└── vite.config.js
```

### 5. 개발 워크플로우

#### 새 기능 개발 시

1. **필요한 shadcn 컴포넌트 확인**
   - [shadcn/ui 문서](https://ui.shadcn.com/docs/components) 참조
   
2. **컴포넌트 설치**
   ```bash
   npx shadcn@latest add [component-name]
   ```

3. **컴포넌트 import 및 사용**
   ```jsx
   import { ComponentName } from "@/components/ui/component-name"
   ```

4. **Tailwind 클래스로 커스터마이징**

#### 폼 작성 시

폼 관련 작업 시 shadcn/ui의 Form 컴포넌트와 함께 React Hook Form 사용:

```bash
# 필요한 패키지 설치
npm install react-hook-form @hookform/resolvers zod
npx shadcn@latest add form
```

```jsx
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function MyForm() {
  const form = useForm()
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input placeholder="이름 입력" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">제출</Button>
      </form>
    </Form>
  )
}
```

### 6. 베스트 프랙티스

#### 6.1 컴포넌트 조합

shadcn/ui 컴포넌트를 조합하여 복잡한 UI 구축:

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function ProductCard({ product }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{product.name}</CardTitle>
          <Badge>{product.category}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-2xl font-bold mt-4">{product.price}원</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">장바구니에 추가</Button>
      </CardFooter>
    </Card>
  )
}
```

#### 6.2 다크 모드 지원

shadcn/ui는 다크 모드를 기본 지원합니다. `next-themes` 사용 권장:

```bash
npm install next-themes
```

```jsx
// src/components/theme-provider.jsx
import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext()

export function ThemeProvider({ children, defaultTheme = "system", ...props }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }
    
    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
```

#### 6.3 재사용 가능한 컴포넌트 패턴

```jsx
// src/components/data-table.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTable({ columns, data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((column) => (
              <TableCell key={column.key}>{row[column.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### 7. 주의사항

1. **shadcn/ui는 복사-붙여넣기 방식**: 컴포넌트가 `src/components/ui`에 직접 추가되므로 자유롭게 수정 가능
2. **의존성 확인**: 일부 컴포넌트는 추가 패키지 필요 (자동으로 설치됨)
3. **커스터마이징**: 컴포넌트 파일을 직접 수정하여 프로젝트에 맞게 조정 가능
4. **버전 관리**: `components.json` 파일은 Git에 포함하여 설정 공유

### 8. 유용한 리소스

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Radix UI 문서](https://www.radix-ui.com) (shadcn/ui의 기반)

## 체크리스트

프로젝트 시작 시 다음을 확인하세요:

- [ ] shadcn/ui 초기화 완료 (`npx shadcn@latest init`)
- [ ] Tailwind CSS 설정 완료
- [ ] Vite path alias 설정 (`@` → `./src`)
- [ ] 필요한 shadcn 컴포넌트 설치
- [ ] 다크 모드 지원 (선택사항)

## 예제: 완성된 페이지

```jsx
// src/pages/Dashboard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Button>새로 만들기</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="reports">보고서</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  총 매출
                </CardTitle>
                <Badge>+12%</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩12,345,678</div>
                <p className="text-xs text-muted-foreground">
                  지난달 대비
                </p>
              </CardContent>
            </Card>
            
            {/* 더 많은 카드... */}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>분석 데이터</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 차트 또는 분석 내용 */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

**마지막 업데이트**: 2025-11-18

이 가이드라인을 따라 일관성 있고 유지보수 가능한 React 애플리케이션을 구축하세요.




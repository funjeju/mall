# shadcn/ui 설정 완료! 🎉

## ✅ 완료된 작업

1. **Tailwind CSS 설치 및 설정**
   - ✅ `tailwind.config.js` 생성 (shadcn/ui 테마 변수 포함)
   - ✅ `postcss.config.js` 생성
   - ✅ Tailwind directives를 `src/index.css`에 추가
   - ✅ 라이트/다크 모드 CSS 변수 설정

2. **Vite 설정 업데이트**
   - ✅ Path alias 추가 (`@` → `./src`)
   - ✅ `import path from "path"` 추가

3. **shadcn/ui 초기화**
   - ✅ `components.json` 생성
   - ✅ `src/lib/utils.js` 생성 (cn 유틸리티 함수)
   - ✅ `src/components/ui/` 디렉토리 생성

## 🚀 다음 단계: 필요한 패키지 설치

터미널에서 다음 명령어를 **순서대로** 실행하세요:

### 1단계: 필수 의존성 설치

```bash
cd my-react-app
npm install -D tailwindcss-animate class-variance-authority clsx tailwind-merge
```

### 2단계: Radix UI 아이콘 설치 (선택사항)

```bash
npm install lucide-react
```

### 3단계: 기본 컴포넌트 설치

자주 사용하는 컴포넌트들을 설치하세요:

```bash
# 기본 UI 컴포넌트
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label

# 또는 한 번에 설치
npx shadcn@latest add button card input label
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

## 📦 추천 컴포넌트 목록

필요에 따라 아래 컴포넌트를 추가로 설치하세요:

```bash
# 폼 관련
npx shadcn@latest add form textarea select checkbox radio-group switch

# 네비게이션
npx shadcn@latest add tabs navigation-menu breadcrumb

# 피드백
npx shadcn@latest add toast alert dialog

# 데이터 표시
npx shadcn@latest add table badge avatar

# 레이아웃
npx shadcn@latest add separator scroll-area accordion
```

## 🎨 첫 컴포넌트 사용 예제

`src/App.jsx`를 다음과 같이 수정해보세요:

```jsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">shadcn/ui 설정 완료!</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>환영합니다 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              shadcn/ui와 Tailwind CSS가 성공적으로 설정되었습니다.
            </p>
            <Button>시작하기</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
```

## 📚 참고 문서

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [프로젝트 AGENTS.md](./AGENTS.md) - AI 에이전트 개발 가이드라인

## ⚠️ 중요 사항

1. **path alias 사용**: 컴포넌트 import 시 반드시 `@/` 접두사 사용
   ```jsx
   import { Button } from "@/components/ui/button"  // ✅ 올바름
   import { Button } from "./components/ui/button"   // ❌ 잘못됨
   ```

2. **Tailwind 클래스 우선**: 인라인 스타일 대신 Tailwind 유틸리티 클래스 사용

3. **다크 모드**: `className="dark"`를 `<html>` 또는 `<body>`에 추가하면 다크 모드 활성화

## 🔧 트러블슈팅

### path alias 에러가 발생하는 경우

`jsconfig.json` 파일을 프로젝트 루트에 생성:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind 클래스가 적용되지 않는 경우

1. 개발 서버 재시작: `npm run dev`
2. `tailwind.config.js`의 `content` 배열 확인
3. 브라우저 캐시 삭제

---

**설정 완료일**: 2025-11-18
**다음 작업**: 위의 npm 명령어들을 실행하여 패키지 설치 완료하기




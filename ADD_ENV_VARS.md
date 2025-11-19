# Vercel 환경 변수 추가 상세 가이드

## 방법 1: Vercel Dashboard (UI)

### 단계별 스크린샷 위치 설명

1. **https://vercel.com/dashboard** 접속
   
2. **프로젝트 클릭**
   - 프로젝트 카드에서 "mall" 또는 배포한 프로젝트 이름 클릭

3. **상단 탭 메뉴**
   ```
   [Overview] [Deployments] [Analytics] [Settings] [More]
                                         ^^^^^^^^
                                         여기 클릭!
   ```

4. **왼쪽 사이드바 메뉴**
   ```
   Settings
   ├─ General
   ├─ Domains
   ├─ Environment Variables  ← 여기!
   ├─ Git
   ├─ Functions
   └─ ...
   ```

5. **환경 변수 페이지**
   - 페이지 중앙 또는 우측 상단에 **"Add New"** 버튼
   - 또는 입력 폼이 직접 보임

6. **입력 양식**
   ```
   Key (Name):   [VITE_SUPABASE_URL        ]
   Value:        [your_supabase_url        ]
   
   Environments:
   [✓] Production
   [✓] Preview  
   [✓] Development
   
   [Save] 버튼
   ```

## 방법 2: 프로젝트 재생성 (환경 변수 포함)

이 방법이 가장 확실합니다!

1. **기존 프로젝트 삭제** (선택사항)
   - Settings → General → 맨 아래 "Delete Project"

2. **새로 Import**
   - https://vercel.com/new 접속
   - GitHub에서 `funjeju/mall` 선택
   - "Import" 클릭

3. **Configure Project 화면**
   - Framework Preset: Vite (자동 감지)
   - Root Directory: `./`
   - **Environment Variables 섹션이 여기 표시됨!**
   
4. **환경 변수 입력**
   ```
   NAME                     | VALUE
   ─────────────────────────┼──────────────────────────
   VITE_SUPABASE_URL       | https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY  | eyJxxx...
   VITE_TOSS_CLIENT_KEY    | test_ck_xxx...
   ```

5. **Deploy 클릭**

## 방법 3: Vercel CLI

터미널에서 직접 추가:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리로 이동
cd C:\Users\na\Desktop\vibecoding\my-react-app

# 환경 변수 추가
vercel env add VITE_SUPABASE_URL production
# 값 입력 프롬프트가 나타남

vercel env add VITE_SUPABASE_ANON_KEY production

vercel env add VITE_TOSS_CLIENT_KEY production

# 재배포
vercel --prod
```

## 방법 4: vercel.json 파일 사용 (권장하지 않음)

환경 변수는 보안상 파일에 직접 저장하지 않는 것이 좋습니다.
대신 Vercel Dashboard에서 설정하세요.

## 🆘 문제 해결

### "Settings 탭이 안 보여요"
→ 프로젝트 카드를 클릭했는지 확인하세요 (목록 화면이 아님)

### "Environment Variables 메뉴가 없어요"
→ 왼쪽 사이드바를 스크롤해보세요
→ 권한이 없을 수 있습니다 (Owner/Admin만 가능)

### "Add New 버튼이 안 보여요"
→ 페이지를 새로고침하세요
→ 다른 브라우저를 시도해보세요
→ 방법 2 (프로젝트 재생성)를 사용하세요

### "환경 변수를 추가했는데 적용이 안 돼요"
→ 반드시 재배포해야 합니다!
→ Deployments → ... → Redeploy

## 📱 모바일에서 추가하기

모바일 브라우저에서는 UI가 다를 수 있습니다:
1. 햄버거 메뉴(☰) → Settings
2. Environment Variables 탭
3. + 버튼 또는 Add 버튼

---

**가장 확실한 방법: 방법 2 (프로젝트 재생성)**

https://vercel.com/new 에서 다시 Import하면 환경 변수 입력 화면이 명확하게 보입니다!


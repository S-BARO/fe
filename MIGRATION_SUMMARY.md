# Next.js 마이그레이션 완료 요약

## 완료된 작업

1. ✅ `package.json` 업데이트 - Next.js 추가, vite/react-router 제거
2. ✅ `next.config.js` 생성
3. ✅ `tsconfig.json` 업데이트
4. ✅ `app/layout.tsx` 생성 (메인 레이아웃)
5. ✅ `app/page.tsx` 생성 (홈 페이지)
6. ✅ `app/Layout/RootLayout.tsx` 업데이트 (react-router → next/navigation)
7. ✅ 주요 컴포넌트 업데이트:
   - `useTabFilter.ts` - next/navigation 사용
   - `AuthGuard.tsx` - next/navigation 사용
   - `Header.tsx` - next/navigation 사용
   - `GNB.tsx` - next/navigation 사용
   - `ProductItem.tsx` - next/navigation 사용
   - `SwipeCards.tsx` - next/navigation 사용
   - `LikedLooks.tsx` - next/navigation 사용

8. ✅ 주요 페이지 생성:
   - `/product/[id]` → `app/product/[id]/page.tsx`
   - `/login` → `app/login/page.tsx`
   - `/login/kakao/callback` → `app/login/kakao/callback/page.tsx`
   - `/swap` → `app/swap/page.tsx`
   - `/look/[id]` → `app/look/[id]/page.tsx`
   - `/baro-fitting` → `app/baro-fitting/page.tsx`

## 남은 작업

아래 페이지들을 생성해야 합니다 (동일한 패턴):

1. `/cart` → `app/cart/page.tsx`
   - `CartPage.tsx`를 복사하여 생성
   - `useNavigate` → `useRouter` 변경
   - `AuthGuard`로 감싸기

2. `/order/confirm` → `app/order/confirm/page.tsx`
   - `OrderConfirmPage.tsx`를 복사하여 생성
   - `useNavigate`, `useLocation` → `useRouter`, `useSearchParams` 변경
   - `AuthGuard`로 감싸기

3. `/order/success` → `app/order/success/page.tsx`
   - `OrderSuccessPage.tsx`를 복사하여 생성
   - `useNavigate`, `useLocation` → `useRouter`, `useSearchParams` 변경
   - `AuthGuard`로 감싸기

4. `/my` → `app/my/page.tsx`
   - `MyPage.tsx`를 복사하여 생성
   - `useNavigate` → `useRouter` 변경
   - `AuthGuard`로 감싸기

5. `/my/orders` → `app/my/orders/page.tsx`
   - `MyOrdersPage.tsx`를 복사하여 생성
   - `useNavigate` → `useRouter` 변경
   - `AuthGuard`로 감싸기

6. `/my/orders/[orderId]` → `app/my/orders/[orderId]/page.tsx`
   - `OrderDetailPage.tsx`를 복사하여 생성
   - `useParams`, `useNavigate` → `useParams`, `useRouter` 변경
   - `AuthGuard`로 감싸기

## 주요 변경사항

### React Router → Next.js Navigation

```typescript
// Before
import { useNavigate, useLocation, useParams } from "react-router";

const navigate = useNavigate();
const location = useLocation();
const { id } = useParams<{ id: string }>();

navigate("/path");
navigate("/path", { replace: true });

// After
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";

const router = useRouter();
const pathname = usePathname();
const params = useParams();
const id = params?.id as string;
const searchParams = useSearchParams();

router.push("/path");
router.replace("/path");
```

### 모든 페이지는 "use client" 디렉티브 필요

Next.js App Router는 기본적으로 Server Components이므로, 클라이언트 컴포넌트에는 `"use client"`를 추가해야 합니다.

### 라우팅 구조

- React Router: `routes.tsx`에 모든 라우트 정의
- Next.js: 파일 시스템 기반 라우팅 (`app/` 디렉토리 구조)

## 다음 단계

1. `pnpm install` 실행하여 Next.js 의존성 설치
2. 남은 페이지들 생성 (위 목록 참고)
3. 모든 컴포넌트에서 `react-router` import 제거 확인
4. `vite.config.ts`, `index.html` 등 Vite 관련 파일 정리 (선택사항)
5. `pnpm dev`로 개발 서버 실행 테스트

## 주의사항

- 모든 클라이언트 컴포넌트에 `"use client"` 추가 필요
- `window` 객체 사용 시 클라이언트 컴포넌트에서만 가능
- `useSearchParams()`는 Suspense로 감싸야 할 수 있음 (Next.js 13+)


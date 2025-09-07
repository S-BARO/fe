# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 장바구니 API 사용 시 주의사항

- 서버는 장바구니 항목 식별자로 `itemId`를 사용합니다(요청: PATCH/DELETE 모두 `itemId`).
- 현재 UI 상의 수량 스테퍼는 `productId` 기준으로 동작하며, 내부에서 해당 `productId`에 매칭되는 `itemId`를 조회해 서버에는 `itemId`로 호출합니다.
- `itemId`가 64비트 정수(자바스크립트 Number 정밀도 한계 초과)인 경우 숫자 반올림 이슈가 발생할 수 있습니다.
  - 권장: 서버가 `itemId`를 문자열(string)로 반환
  - 대안: 프런트에서 `itemId`를 문자열로 파싱/보관하여 사용

### API 개요

- 추가: `POST /cart/items` body `{ productId, quantity }`
- 수정(수량): `PATCH /cart/items/{itemId}` body `{ quantity }`
- 삭제: `DELETE /cart/items/{itemId}`
- 조회: `GET /cart` → 아래 예시 형태로 응답

```json
{
  "items": [
    {
      "itemId": 752574875820142613,
      "productId": 1766368,
      "productName": "product_1766368",
      "productThumbnailUrl": "https://.../8.webp",
      "price": 55542,
      "quantity": 1,
      "subtotal": 55542
    }
  ],
  "totalPrice": 55542
}
```

### 왜 정밀도 문제가 발생하나요?

- 자바스크립트 Number는 IEEE-754 배정밀도 부동소수로, 안전한 정수 범위는 \(−2^{53}+1 \) ~ \(2^{53}−1\) 입니다.
- `itemId`처럼 64비트 정수(예: 752574875820142613)를 Number로 다루면 끝자리가 `...600`처럼 반올림될 수 있습니다.
- 증상: 서버에 존재하는 `itemId`로 호출했는데 404/"항목을 찾을 수 없습니다"가 발생.

### 프런트 구현 방안

1) UI는 `productId` 기준으로 동작시키고, 내부에서 `itemId`를 찾아 API는 `itemId`로 호출
   - 사용자 상호작용은 제품 단위로 직관적이며, 정밀도 문제를 회피
2) 가능하면 `itemId`를 문자열(string)로 다루기
   - 서버가 문자열로 반환하면 정밀도 문제 없음
   - 서버가 숫자 형태로 반환 시, `json-bigint` 같은 파서를 사용해 문자열로 저장하는 방법도 있음

### 코드 예시

수량 스테퍼 클릭 → `productId`로 대상 찾기 → 서버에는 `itemId`로 PATCH → 로컬 상태는 `productId` 기준으로 갱신

```ts
// 의사코드: 실제 구현은 src/pages/cart/CartPage.tsx 참고
async function handleQtyChangeByProduct(productId: number, nextQty: number) {
  if (nextQty < 1) return;
  const target = items.find((it) => it.productId === productId);
  if (!target) return;
  await updateCartItemQuantity(target.itemId, nextQty); // 서버 요청은 itemId 사용
  setItems((prev) =>
    prev.map((it) =>
      it.productId === productId
        ? { ...it, quantity: nextQty, subtotal: it.price * nextQty }
        : it
    )
  );
}
```

삭제도 동일하게 `productId` → `itemId` 매핑 후 `DELETE /cart/items/{itemId}`를 호출하면 됩니다.

### 서버/클라이언트 권고사항

- 서버
  - `itemId`는 가급적 문자열로 반환 (JSON 숫자 정밀도 이슈 회피)
  - 동일 `productId`를 장바구니에 여러 번 담을 수 있게 할지 정책 결정(옵션/옵션값이 없으면 하나로 병합 권장)
- 클라이언트
  - `productId`로 항목을 식별하지만, API 호출 시에는 반드시 `itemId` 사용
  - 만약 `itemId`가 숫자로 내려오면, 내부 저장은 문자열로 변환해 정밀도 문제를 차단

### 테스트 체크리스트

- 조회 직후 `items` 배열에 대해:
  - 수량 증가/감소 시 정상 반영(서버 204, 로컬 상태 동기화)
  - 삭제 시 항목 제거 및 합계 갱신
  - `itemId`가 매우 큰 값이어도(64비트) 오류 없이 동작
- 네트워크 탭 확인:
  - 수량 수정 요청: `PATCH /cart/items/{itemId}` (path에 실제 itemId)
  - 삭제 요청: `DELETE /cart/items/{itemId}`

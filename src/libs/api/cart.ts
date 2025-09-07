import { credentialApi } from "./axios";
import type { AddCartItemRequest, CartResponse } from "./types";

export async function addCartItem(body: AddCartItemRequest): Promise<void> {
  await credentialApi.post("/cart/items", body);
}

// 장바구니 아이템 삭제
export async function deleteCartItem(itemId: string): Promise<void> {
  await credentialApi.delete(`/cart/items/${itemId}`);
}

// 장바구니 수량 수정
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<void> {
  await credentialApi.patch(`/cart/items/${itemId}`, { quantity });
}

// 장바구니 조회
export async function getCart(): Promise<CartResponse> {
  // 큰 정수 itemId 정밀도 보존을 위해 수동 파싱
  const res = await credentialApi.get("/cart", {
    responseType: "text",
    transformResponse: [
      (data: string) => {
        try {
          return JSON.parse(data, (key, value) =>
            key === "itemId" ? String(value) : value
          );
        } catch {
          return data;
        }
      },
    ],
  });
  return res.data as CartResponse;
}

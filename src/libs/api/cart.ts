import { credentialApi } from "./axios";
import type { AddCartItemRequest, CartResponse } from "./types";

export async function addCartItem(body: AddCartItemRequest): Promise<void> {
  await credentialApi.post("/cart/items", body);
}

// 장바구니 아이템 삭제
export async function deleteCartItem(itemId: string | number): Promise<void> {
  await credentialApi.delete(`/cart/items/${itemId}`);
}

// 장바구니 수량 수정
export async function updateCartItemQuantity(
  itemId: string | number,
  quantity: number
): Promise<void> {
  await credentialApi.patch(`/cart/items/${itemId}`, { quantity });
}

// 장바구니 조회
export async function getCart(): Promise<CartResponse> {
  const res = await credentialApi.get<CartResponse>("/cart");
  return res.data;
}



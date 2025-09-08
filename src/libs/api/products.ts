import { publicApi, credentialApi } from "./axios";
import type { PopularResponse, PopularProductsParams, NewestResponse, NewestProductsParams, ProductDetail, SwipeLooksParams, SwipeLooksResponse, PutLookReactionRequest, LookDetailResponse, OrderCreateRequest, OrderDetailResponse, OrdersSliceParams, OrdersSliceResponse } from "./types";

// 인기 상품 목록 API
export async function getPopularProducts(params: PopularProductsParams = {}): Promise<PopularResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.categoryId) {
    queryParams.append('categoryId', params.categoryId.toString());
  }
  if (params.cursorId) {
    queryParams.append('cursorId', params.cursorId.toString());
  }
  if (params.cursorLikes) {
    queryParams.append('cursorLikes', params.cursorLikes.toString());
  }
  if (params.size) {
    queryParams.append('size', params.size.toString());
  }

  const url = `/products/popular${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await publicApi.get<PopularResponse>(url);
  
  return response.data;
}

// 최신 상품 목록 API
export async function getNewestProducts(params: NewestProductsParams = {}): Promise<NewestResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.categoryId) {
    queryParams.append('categoryId', params.categoryId.toString());
  }
  if (params.cursorId) {
    queryParams.append('cursorId', params.cursorId.toString());
  }
  if (params.size) {
    queryParams.append('size', params.size.toString());
  }

  const url = `/products/newest${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await publicApi.get<NewestResponse>(url);
  
  return response.data;
}

// 상품 상세 API
export async function getProductDetail(productId: string | number): Promise<ProductDetail> {
  const response = await publicApi.get<ProductDetail>(
    `/products/${encodeURIComponent(String(productId))}`
  );
  return response.data;
}

// 스와이프 룩 목록 API (무한 스크롤)
// GET /looks/swipe?cursorId=...&size=...
export async function getSwipeLooks(params: SwipeLooksParams = {}): Promise<SwipeLooksResponse> {
  const queryParams = new URLSearchParams();

  if (params.cursorId) {
    queryParams.append('cursorId', params.cursorId.toString());
  }
  if (params.size) {
    queryParams.append('size', params.size.toString());
  }

  const url = `/looks/swipe${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await credentialApi.get<SwipeLooksResponse>(url);
  return response.data;
}

// 룩 반응 등록 (멱등)
// PUT /looks/{lookId}/reaction  body: { reactionType: "LIKE" | "DISLIKE" }
export async function putLookReaction(lookId: number, body: PutLookReactionRequest): Promise<void> {
  await credentialApi.put(`/looks/${encodeURIComponent(String(lookId))}/reaction`, body);
}

// 룩 반응 취소 (멱등)
// DELETE /looks/{lookId}/reaction
export async function deleteLookReaction(lookId: number): Promise<void> {
  await credentialApi.delete(`/looks/${encodeURIComponent(String(lookId))}/reaction`);
}

// 룩 상세 조회
// GET /looks/{lookId}
export async function getLookDetail(lookId: number): Promise<LookDetailResponse> {
  const res = await credentialApi.get<LookDetailResponse>(
    `/looks/${encodeURIComponent(String(lookId))}`
  );
  return res.data;
}

// 주문 생성
// POST /orders
export async function createOrder(body: OrderCreateRequest): Promise<OrderDetailResponse> {
  const res = await credentialApi.post<OrderDetailResponse>("/orders", body);
  return res.data;
}

// 주문 목록 조회 (무한 스크롤)
// GET /orders?cursorId=&size=
export async function getOrders(params: OrdersSliceParams = {}): Promise<OrdersSliceResponse> {
  const qs = new URLSearchParams();
  if (typeof params.cursorId === "number") qs.append("cursorId", String(params.cursorId));
  if (typeof params.size === "number") qs.append("size", String(params.size));
  const url = `/orders${qs.toString() ? `?${qs.toString()}` : ""}`;
  const res = await credentialApi.get<OrdersSliceResponse>(url);
  return res.data;
}

// 주문 상세 조회
// GET /orders/{orderId}
export async function getOrderDetail(orderId: number | string): Promise<OrderDetailResponse> {
  const res = await credentialApi.get<OrderDetailResponse>(`/orders/${encodeURIComponent(String(orderId))}`);
  return res.data;
}

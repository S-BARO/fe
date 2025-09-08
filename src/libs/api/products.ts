import { publicApi, credentialApi } from "./axios";
import type { PopularResponse, PopularProductsParams, NewestResponse, NewestProductsParams, ProductDetail, SwipeLooksParams, SwipeLooksResponse, PutLookReactionRequest } from "./types";

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

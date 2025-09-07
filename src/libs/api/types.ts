// API 응답 타입 정의
export interface LoginRequest {
  provider: "KAKAO";
  accessToken: string;
}

export interface LoginResponse {
  isNew: boolean;
}

export interface ApiError {
  message: string;
}

// 사용자 관련 타입 정의
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

// 상품 관련 타입 정의
export interface Product {
  id: number;
  storeName: string;
  productName: string;
  price: number;
  thumbnailUrl: string;
}

export interface ProductDetail {
  id: number;
  storeName: string;
  productName: string;
  price: number;
  description: string;
  images: string[];
  categories: string[];
}

export interface PopularResponse {
  content: Product[];
  hasNext: boolean;
  nextCursor: {
    id: number;
    likes: number;
  };
}

export interface NewestResponse {
  content: Product[];
  hasNext: boolean;
  nextCursor: {
    id: number;
  };
}

export interface PopularProductsParams {
  categoryId?: number;
  cursorId?: number;
  cursorLikes?: number;
  size?: number;
}

export interface NewestProductsParams {
  categoryId?: number;
  cursorId?: number;
  size?: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartItemDto {
  itemId: number;
  productId: number;
  productName: string;
  productThumbnailUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItemDto[];
  totalPrice: number;
}

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
  productId: string; // 서버 변경에 따라 문자열로 전송
  quantity: number;
}

export interface CartItemDto {
  itemId: string; // 64-bit 정수 안전 처리: 문자열로 보관
  productId: string; // 서버 변경에 따라 문자열로 수신
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

// 스와이프 룩 타입 정의
export interface SwipeLookItem {
  lookId: number;
  title: string;
  thumbnailUrl: string;
  likesCount?: number;
}

export interface SwipeLooksResponse {
  content: SwipeLookItem[];
  hasNext: boolean;
  nextCursor: {
    id: number;
  };
}

export interface SwipeLooksParams {
  cursorId?: number;
  size?: number; // 기본 10
}

// 룩 반응 타입 정의
export type ReactionType = "LIKE" | "DISLIKE";
export interface PutLookReactionRequest {
  reactionType: ReactionType;
}

// 룩 상세 타입 정의
export interface LookImageItem {
  imageUrl: string;
  displayOrder: number;
}

export interface LookProductItem {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  displayOrder: number;
  storeName?: string; // 브랜드/스토어명 (서버가 제공 시 표시)
}

export interface LookDetailResponse {
  lookId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  likesCount: number;
  images: LookImageItem[];
  products: LookProductItem[];
}

// 주문 타입 정의
export interface OrderCreateItem {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  shippingAddress: string;
  orderItems: OrderCreateItem[];
}

export type OrderStatus = "ORDERED" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItemDetail {
  productId: number;
  productName: string;
  thumbnailUrl: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderDetailResponse {
  orderId: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  totalPrice: number;
  orderedAt: string; // ISO8601
  items: OrderItemDetail[];
}

export interface OrdersSliceItem {
  orderId: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  orderedAt: string;
}

export interface OrdersSliceResponse {
  content: OrdersSliceItem[];
  hasNext: boolean;
  nextCursor?: { id: number };
}

export interface OrdersSliceParams {
  cursorId?: number;
  size?: number;
}

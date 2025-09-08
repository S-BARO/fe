// Axios 인스턴스
export { credentialApi, publicApi } from "./axios";

// 타입 정의
export type {
  LoginRequest,
  LoginResponse,
  ApiError,
  UserProfile,
  Product,
  ProductDetail,
  PopularResponse,
  PopularProductsParams,
  NewestResponse,
  NewestProductsParams,
  AddCartItemRequest,
  CartItemDto,
  CartResponse,
  SwipeLookItem,
  SwipeLooksResponse,
  SwipeLooksParams,
} from "./types";

// 인증 관련 API
export {
  loginWithOAuth,
  loginWithOAuthCode,
  checkAuthStatus,
  getUserProfile,
  logout,
} from "./auth";

// 상품 관련 API
export {
  getPopularProducts,
  getNewestProducts,
  getProductDetail,
  getSwipeLooks,
} from "./products";

// 장바구니 관련 API
export { addCartItem, deleteCartItem, updateCartItemQuantity, getCart } from "./cart";

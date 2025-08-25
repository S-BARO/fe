// Axios 인스턴스
export { credentialApi, publicApi } from "./axios";

// 타입 정의
export type {
  LoginRequest,
  LoginResponse,
  ApiError,
  Product,
  PopularResponse,
  PopularProductsParams,
} from "./types";

// 인증 관련 API
export {
  loginWithOAuth,
  checkAuthStatus,
  getUserProfile,
  logout,
} from "./auth";

// 상품 관련 API
export {
  getPopularProducts,
} from "./products";

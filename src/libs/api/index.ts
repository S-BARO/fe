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
  ReactionType,
  PutLookReactionRequest,
  LookImageItem,
  LookProductItem,
  LookDetailResponse,
  OrderCreateItem,
  OrderCreateRequest,
  OrderDetailResponse,
  OrderStatus,
  OrdersSliceItem,
  OrdersSliceResponse,
  OrdersSliceParams,
  LikedLookItem,
  LikedLooksResponse,
  LikedLooksParams,
  FittingSourceImage,
  FittingSourceImagesResponse,
  UploadUrlResponse,
  AiFittingRequest,
  UpdateAddressRequest,
} from "./types";

// 인증 관련 API
export {
  loginWithOAuth,
  loginWithOAuthCode,
  checkAuthStatus,
  getUserProfile,
  updateUserAddress,
  logout,
} from "./auth";

// 상품 관련 API
export {
  getPopularProducts,
  getNewestProducts,
  getProductDetail,
  getSwipeLooks,
  putLookReaction,
  deleteLookReaction,
  getLookDetail,
  likeProduct,
  unlikeProduct,
  getLikedLooks,
  createOrder,
  getOrders,
  getOrderDetail,
} from "./products";

// 장바구니 관련 API
export {
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
  getCart,
} from "./cart";

// 피팅 관련 API
export {
  getFittingSourceImages,
  createUploadUrl,
  completeImageUpload,
  createAiFitting,
} from "./fitting";

import { credentialApi } from "./axios";
import type { LoginRequest, LoginResponse, UserProfile } from "./types";

// OAuth 로그인 API (토큰 방식 - v1)
export async function loginWithOAuth(
  provider: "KAKAO",
  accessToken: string
): Promise<LoginResponse> {
  const body: LoginRequest = { provider, accessToken };
  // 쿠키 발급을 위해 withCredentials 인스턴스를 사용
  const res = await credentialApi.post<LoginResponse>("/auth/login/oauth", body);

  return res.data;
}

// OAuth 로그인 API (인가 코드 방식 - v2)
export async function loginWithOAuthCode(
  provider: "KAKAO",
  authorizationCode: string,
  redirectUri: string
): Promise<LoginResponse> {
  // 쿠키 발급을 위해 withCredentials 인스턴스를 사용
  const res = await credentialApi.post<LoginResponse>("/auth/login/oauth", {
    provider,
    authorizationCode,
    redirectUri,
  });
  return res.data;
}

// 인증 상태 확인 함수
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await credentialApi.get("/users/me");
    return response.status === 200;
  } catch (error: unknown) {
    // 401/403은 비인증으로 처리, 그 외는 상위에서 핸들링
    const axiosError = error as { status?: number; response?: { status?: number } };
    const status = axiosError?.status ?? axiosError?.response?.status;
    if (status === 401 || status === 403) return false;
    throw error;
  }
};

// 사용자 정보 가져오기 함수
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await credentialApi.get<UserProfile>("/users/me");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    throw error;
  }
};

// 사용자 주소 업데이트 함수
export const updateUserAddress = async (address: string): Promise<void> => {
  try {
    await credentialApi.patch("/users/me/address", { address });
  } catch (error) {
    console.error("주소 업데이트 실패:", error);
    throw error;
  }
};

// 로그아웃 API
export async function logout(): Promise<void> {
  try {
    await credentialApi.post("/auth/logout");
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}

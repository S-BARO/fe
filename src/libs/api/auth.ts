import { credentialApi, publicApi } from "./axios";
import type { LoginRequest, LoginResponse } from "./types";

// OAuth 로그인 API
export async function loginWithOAuth(
  provider: "KAKAO",
  accessToken: string
): Promise<LoginResponse> {
  const body: LoginRequest = { provider, accessToken };
  const res = await publicApi.post<LoginResponse>("/auth/login/oauth", body);

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
export const getUserProfile = async () => {
  try {
    const response = await credentialApi.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
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

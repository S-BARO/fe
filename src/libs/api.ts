import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

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

// 인증 상태 확인 함수
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await credentialApi.get('/users/me');
    return response.status === 200;
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    return false;
  }
};

// 사용자 정보 가져오기 함수
export const getUserProfile = async () => {
  try {
    const response = await credentialApi.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  }
};

// 로그아웃 API
export async function logout(): Promise<void> {
  try {
    await credentialApi.post('/auth/logout');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
}

// API 기본 설정
const API_BASE_URL = "https://api.s-baro.shop";

const createCredentialInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (import.meta.env.DEV) {
        console.debug(
          "Credential API Request:",
          config.method?.toUpperCase(),
          config.url
        );
      }
      return config;
    },
    (error: AxiosError) => {
      if (import.meta.env.DEV) {
        console.debug("Credential API Request Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(
        "Credential API Response:",
        response.status,
        response.config.url
      );
      return response;
    },
    (error: AxiosError) => {
      console.error(
        "Credential API Response Error:",
        error.response?.status,
        error.response?.data
      );

      // 에러 메시지 처리
      const errorData = error.response?.data as
        | { message?: string }
        | undefined;
      const errorMessage =
        errorData?.message ?? "알 수 없는 오류가 발생했습니다.";
      const status = error.response?.status;
      const customError = Object.assign(new Error(errorMessage), {
        status,
        data: error.response?.data,
      });
      return Promise.reject(customError);
    }
  );

  return instance;
};

// 퍼블릭 인스턴스 (쿠키 미포함)
const createPublicInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: false, // 쿠키 미포함
    timeout: 10000,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (import.meta.env.DEV) {
        console.debug(
          "Public API Request:",
          config.method?.toUpperCase(),
          config.url
        );
      }
      return config;
    },
    (error: AxiosError) => {
      if (import.meta.env.DEV) {
        console.debug("Public API Request Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("Public API Response:", response.status, response.config.url);
      return response;
    },
    (error: AxiosError) => {
      console.error(
        "Public API Response Error:",
        error.response?.status,
        error.response?.data
      );

      // 에러 메시지 처리
      const errorData = error.response?.data as
        | { message?: string }
        | undefined;
      const errorMessage =
        errorData?.message ?? "알 수 없는 오류가 발생했습니다.";
      const status = error.response?.status;
      const customError = Object.assign(new Error(errorMessage), {
        status,
        data: error.response?.data,
      });
      return Promise.reject(customError);
    }
  );

  return instance;
};

// 인스턴스 생성
const credentialApi = createCredentialInstance();
const publicApi = createPublicInstance();

// OAuth 로그인 API (크리덴셜 필요)
export async function loginWithOAuth(
  provider: "KAKAO",
  accessToken: string
): Promise<LoginResponse> {
  const body: LoginRequest = { provider, accessToken };
  const res = await credentialApi.post<LoginResponse>("/auth/login/oauth", body);

  return res.data;
}

// 인스턴스 직접 사용을 위한 export (필요시)
export { credentialApi, publicApi };

import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

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
export const credentialApi = createCredentialInstance();
export const publicApi = createPublicInstance();

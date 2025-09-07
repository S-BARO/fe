import type { KakaoAuthResponse, KakaoUser } from "../types/kakao";

const KAKAO_SDK_URL = "https://developers.kakao.com/sdk/js/kakao.min.js";

// Kakao SDK 스크립트 로드 보장
const loadKakaoSdkScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드됨
    if (typeof window !== "undefined" && (window as any).Kakao) {
      resolve();
      return;
    }

    // 기존 스크립트 태그 탐색
    const existing = Array.from(document.getElementsByTagName("script")).find(
      (s) => (s.src || "").includes("developers.kakao.com/sdk/js/kakao")
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Kakao SDK script failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK script failed to load"));
    document.head.appendChild(script);
  });
};

// 카카오 SDK 초기화
export const initKakaoSDK = (appKey: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!window.Kakao) {
        await loadKakaoSdkScript();
      }
      if (!window.Kakao) {
        reject(new Error("Kakao SDK not loaded"));
        return;
      }
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

// 카카오 로그인 실행
export const loginWithKakao = (): Promise<KakaoAuthResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    const kakao = window.Kakao;
    const hasPopupLogin = typeof kakao.Auth?.login === "function";
    const hasAuthorize = typeof (kakao.Auth as any)?.authorize === "function";

    if (hasPopupLogin) {
      // v1 SDK: 팝업 로그인
      kakao.Auth.login({
        success: (authObj: KakaoAuthResponse) => {
          resolve(authObj);
        },
        fail: (err: unknown) => {
          reject(err);
        },
      });
      return;
    }

    if (hasAuthorize) {
      // v2 SDK: 리다이렉트 방식
      const redirectUri = `${window.location.origin}/login/kakao/callback`;
      try {
        (kakao.Auth as unknown as { authorize: (opts: { redirectUri: string; state?: string }) => void }).authorize({
          redirectUri,
        });
        // 리다이렉트가 발생하므로 Promise는 resolve/reject 없이 유지됩니다.
      } catch (e) {
        reject(e);
      }
      return;
    }

    reject(new Error("Kakao Auth method not available (login/authorize)"));
  });
};

// 카카오 사용자 정보 가져오기
export const getKakaoUserInfo = (): Promise<KakaoUser> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    window.Kakao.API.request({
      url: "/v2/user/me",
        success: (res: unknown) => {
        if (typeof res !== "object" || res === null || !("id" in res)) {
          reject(new Error("Invalid response format"));
          return;
        }
        const user = res as KakaoUser;
        resolve(user);
      },
      fail: (err: unknown) => {
        reject(err);
      },
    });
  });
};

// 카카오 로그아웃
export const logoutFromKakao = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    window.Kakao.Auth.logout(() => {
      resolve();
    });
  });
};

// 로컬 스토리지에 토큰 저장
export const saveKakaoToken = (token: string): void => {
  localStorage.setItem("kakao_access_token", token);
};

// 로컬 스토리지에서 토큰 가져오기
export const getKakaoToken = (): string | null => {
  return localStorage.getItem("kakao_access_token");
};

// 로컬 스토리지에서 토큰 삭제
export const removeKakaoToken = (): void => {
  localStorage.removeItem("kakao_access_token");
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return !!getKakaoToken();
};

// 사용자 정보 저장
export const saveUserInfo = (userInfo: KakaoUser): void => {
  localStorage.setItem("user_info", JSON.stringify(userInfo));
};

// 사용자 정보 가져오기
export const getUserInfo = (): KakaoUser | null => {
  const userInfo = localStorage.getItem("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

// 사용자 정보 삭제
export const removeUserInfo = (): void => {
  localStorage.removeItem("user_info");
};

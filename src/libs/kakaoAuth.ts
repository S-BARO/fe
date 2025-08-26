import type { KakaoAuthResponse, KakaoUser } from "../types/kakao";

// 카카오 SDK 초기화
export const initKakaoSDK = (appKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Kakao) {
      if (window.Kakao.isInitialized()) {
        resolve();
      } else {
        window.Kakao.init(appKey);
        resolve();
      }
    } else {
      reject(new Error("Kakao SDK not loaded"));
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

    window.Kakao.Auth.login({
      success: (authObj: KakaoAuthResponse) => {
        resolve(authObj);
      },
      fail: (err: unknown) => {
        reject(err);
      },
    });
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
      success: (res: KakaoUser) => {
        resolve(res);
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

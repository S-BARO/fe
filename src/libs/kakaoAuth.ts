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
      fail: (err: any) => {
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
      fail: (err: any) => {
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

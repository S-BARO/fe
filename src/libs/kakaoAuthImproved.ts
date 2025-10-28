import type { KakaoAuthResponse, KakaoUser } from "../types/kakao";

const KAKAO_SDK_URL = "https://developers.kakao.com/sdk/js/kakao.min.js";
const KAKAO_CLIENT_ID = "7d021d3904622b1a17c327477770ba58";

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
export const initKakaoSDK = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await loadKakaoSdkScript();
      if (!window.Kakao) {
        throw new Error("Kakao SDK not available after loading");
      }
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_CLIENT_ID);
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

// 플랫폼 감지 함수
const detectPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isMobile = isAndroid || isIOS;
  const isDesktop = !isMobile;
  
  return {
    isAndroid,
    isIOS,
    isMobile,
    isDesktop,
    userAgent
  };
};

// 데스크톱용 웹 OAuth URL 생성
const createWebOAuthUrl = (redirectUri: string): string => {
  const state = Math.random().toString(36).substring(2, 15);
  const webRedirectUri = encodeURIComponent(redirectUri);
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${webRedirectUri}&response_type=code&state=${state}`;
};

// 모바일용 intent URL 생성 (안드로이드)
const createIntentUrl = (redirectUri: string): string => {
  const state = Math.random().toString(36).substring(2, 15);
  const webRedirectUri = encodeURIComponent(redirectUri);
  const kaHeader = encodeURIComponent(`sdk/1.43.6 os/javascript sdk_type/javascript lang/ko-KR device/MacIntel origin/${window.location.origin}`);
  const extraParams = encodeURIComponent(JSON.stringify({ client_id: KAKAO_CLIENT_ID }));
  
  return `intent:#Intent;action=com.kakao.talk.intent.action.CAPRI_LOGGED_IN_ACTIVITY;launchFlags=0x08880000;S.com.kakao.sdk.talk.appKey=${KAKAO_CLIENT_ID};S.com.kakao.sdk.talk.redirectUri=${webRedirectUri};S.com.kakao.sdk.talk.state=${state};S.com.kakao.sdk.talk.kaHeader=${kaHeader};S.com.kakao.sdk.talk.extraparams=${extraParams};S.browser_fallback_url=${encodeURIComponent(createWebOAuthUrl(redirectUri))};end;`;
};

// 카카오 로그인 실행 (개선된 버전)
export const loginWithKakao = (): Promise<KakaoAuthResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    const kakao = window.Kakao;
    const platform = detectPlatform();
    const redirectUri = `${window.location.origin}/login/kakao/callback`;

    console.log("Platform detected:", platform);

    // v1 SDK 팝업 로그인 (데스크톱에서 권장)
    const hasPopupLogin = typeof kakao.Auth?.login === "function";
    if (hasPopupLogin && platform.isDesktop) {
      console.log("Using v1 popup login for desktop");
      kakao.Auth.login({
        success: (authObj: KakaoAuthResponse) => {
          resolve(authObj);
        },
        fail: (err: unknown) => {
          console.error("Popup login failed:", err);
          reject(err);
        },
      });
      return;
    }

    // v2 SDK 리다이렉트 방식
    const hasAuthorize = typeof (kakao.Auth as any)?.authorize === "function";
    if (hasAuthorize) {
      try {
        console.log("Using v2 authorize method");
        // 카카오 SDK v2의 authorize 메서드 사용
        (kakao.Auth as unknown as { authorize: (opts: { redirectUri: string; state?: string }) => void }).authorize({
          redirectUri,
        });
        // 리다이렉트가 발생하므로 Promise는 resolve/reject 없이 유지됩니다.
      } catch (e) {
        console.error("Kakao authorize failed:", e);
        // authorize 실패 시 플랫폼별 대체 방법 사용
        if (platform.isMobile) {
          // 모바일: intent URL 사용
          const intentUrl = createIntentUrl(redirectUri);
          console.log("Using intent URL for mobile:", intentUrl);
          window.location.href = intentUrl;
        } else {
          // 데스크톱: 웹 OAuth URL 사용
          const webUrl = createWebOAuthUrl(redirectUri);
          console.log("Using web OAuth URL for desktop:", webUrl);
          window.location.href = webUrl;
        }
      }
      return;
    }

    // SDK가 없는 경우 플랫폼별 직접 OAuth URL로 리다이렉트
    if (platform.isMobile) {
      const intentUrl = createIntentUrl(redirectUri);
      console.log("SDK not available, using intent URL for mobile:", intentUrl);
      window.location.href = intentUrl;
    } else {
      const webUrl = createWebOAuthUrl(redirectUri);
      console.log("SDK not available, using web OAuth URL for desktop:", webUrl);
      window.location.href = webUrl;
    }
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
      url: "/v1/user/me",
      success: (res: unknown) => {
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

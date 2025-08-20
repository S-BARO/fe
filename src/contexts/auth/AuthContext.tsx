import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { KakaoUser } from "../../types/kakao";
import { AuthContext, type AuthContextType } from "./context";
import {
  initKakaoSDK,
  loginWithKakao,
  logoutFromKakao,
  getKakaoUserInfo,
} from "../../libs/kakaoAuth";
import { 
  loginWithOAuth, 
  checkAuthStatus, 
  getUserProfile, 
  logout as apiLogout, 
  getAllCookies, 
  hasCookie, 
  removeCookie 
} from "../../libs/api";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 카카오 SDK 초기화
  const initializeKakao = async () => {
    try {
      const appKey = "7d021d3904622b1a17c327477770ba58";
      if (!appKey) {
        throw new Error("Kakao app key not found");
      }
      await initKakaoSDK(appKey);
    } catch (error) {
      console.error("Failed to initialize Kakao SDK:", error);
    }
  };

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await initializeKakao();
      
      // 불필요한 쿠키 삭제
      removeCookie('auth_token');
      
      // 개발 환경에서 쿠키 상태 확인
      if (import.meta.env.DEV) {
        const cookies = getAllCookies();
        console.log("현재 쿠키 상태:", cookies);
        console.log("JSESSIONID 쿠키 존재:", hasCookie('JSESSIONID'));
      }
      
      // 서버에서 인증 상태 확인
      const isAuth = await checkAuthStatus();
      
      if (import.meta.env.DEV) {
        console.log("서버 인증 상태:", isAuth);
      }
      
      if (isAuth) {
        // 인증된 경우 사용자 정보 가져오기
        try {
          const userProfile = await getUserProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
          
          if (import.meta.env.DEV) {
            console.log("사용자 정보 로드 완료:", userProfile);
          }
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          // 사용자 정보 가져오기 실패 시 로그아웃 처리
          await handleLogout();
        }
      } else {
        // 인증되지 않은 경우 상태 초기화
        setUser(null);
        setIsAuthenticated(false);
        
        if (import.meta.env.DEV) {
          console.log("인증되지 않은 상태로 초기화");
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그인
  const login = async () => {
    try {
      setIsLoading(true);

      if (import.meta.env.DEV) {
        console.log("로그인 시작, 현재 쿠키:", getAllCookies());
      }

      // 카카오 로그인 실행
      const authResponse = await loginWithKakao();

      if (import.meta.env.DEV) {
        console.log("카카오 로그인 완료, 현재 쿠키:", getAllCookies());
      }

      // 백엔드로 카카오 액세스 토큰 전송하여 세션 생성
      const loginResponse = await loginWithOAuth(
        "KAKAO",
        authResponse.access_token
      );

      if (import.meta.env.DEV) {
        console.log("서버 로그인 완료, 현재 쿠키:", getAllCookies());
        console.log("document.cookie:", document.cookie);
      }

      // 카카오에서 사용자 정보 가져오기
      const kakaoUser = await getKakaoUserInfo();

      // 상태 업데이트 (쿠키 기반이므로 로컬 스토리지에 저장하지 않음)
      setUser(kakaoUser);
      setIsAuthenticated(true);

      if (import.meta.env.DEV) {
        console.log("로그인 완료, 쿠키 상태:", getAllCookies());
        console.log("최종 document.cookie:", document.cookie);
      }

      console.log("Login successful, isNew:", loginResponse.isNew);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // 서버 로그아웃 API 호출
      await apiLogout();
      
      if (import.meta.env.DEV) {
        console.log("서버 로그아웃 완료");
      }
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      // 카카오 로그아웃
      try {
        await logoutFromKakao();
      } catch (error) {
        console.error("카카오 로그아웃 실패:", error);
      }

      // 상태 초기화
      setUser(null);
      setIsAuthenticated(false);
      
      if (import.meta.env.DEV) {
        console.log("로그아웃 완료, 쿠키 상태:", getAllCookies());
      }
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      setIsLoading(true);
      await handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

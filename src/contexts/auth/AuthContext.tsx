import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { KakaoUser } from "../../types/kakao";
import { AuthContext, type AuthContextType } from "./context";
import {
  initKakaoSDK,
  loginWithKakao,
  logoutFromKakao,
  removeKakaoToken,
  saveUserInfo,
  removeUserInfo,
  getKakaoUserInfo,
} from "../../libs/kakaoAuth";
import { loginWithOAuth } from "../../libs/api";

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
      const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
      if (!appKey) {
        throw new Error("Kakao app key not found");
      }
      await initKakaoSDK(appKey);
    } catch (error) {
      console.error("Failed to initialize Kakao SDK:", error);
    }
  };

  // 인증 상태 초기화
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await initializeKakao();

      // 로컬에 저장된 사용자 정보 확인
      const savedUserInfo = localStorage.getItem("userInfo");
      if (savedUserInfo) {
        const userProfile = JSON.parse(savedUserInfo);
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        // 저장된 정보가 없으면 초기화
        removeKakaoToken();
        removeUserInfo();
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      removeKakaoToken();
      removeUserInfo();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그인
  const login = async () => {
    try {
      setIsLoading(true);

      // 카카오 로그인 실행
      const authResponse = await loginWithKakao();

      // 백엔드로 카카오 액세스 토큰 전송하여 세션 생성
      const loginResponse = await loginWithOAuth(
        "KAKAO",
        authResponse.access_token
      );

      // 카카오에서 사용자 정보 가져오기
      const kakaoUser = await getKakaoUserInfo();

      // 상태 업데이트
      setUser(kakaoUser);
      setIsAuthenticated(true);
      saveUserInfo(kakaoUser);

      console.log("Login successful, isNew:", loginResponse.isNew);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      setIsLoading(true);

      // 카카오 로그아웃
      await logoutFromKakao();

      // 로컬 데이터 삭제
      removeKakaoToken();
      removeUserInfo();

      // 상태 초기화
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 초기화
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

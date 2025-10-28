import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { KakaoUser } from "../../types/kakao";
import { AuthContext, type AuthContextType } from "./context";
import {
  initKakaoSDK,
  loginWithKakao,
  logoutFromKakao,
} from "../../libs/kakaoAuth";
import { loginWithOAuth, getUserProfile, logout as apiLogout } from "../../libs/api";

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

  // 서버 세션 상태 확인
  const checkServerSession = async (): Promise<boolean> => {
    try {
      await getUserProfile();
      return true;
    } catch (error) {
      console.log("Server session check failed:", error);
      return false;
    }
  };

  // 인증 상태 초기화
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await initKakaoSDK();

      // 서버 세션 상태 확인
      const hasValidSession = await checkServerSession();

      if (hasValidSession) {
        // 세션이 있으면 인증 true
        setIsAuthenticated(true);
      } else {
        // 세션이 없으면 상태 초기화
        setUser(null);
        setIsAuthenticated(false);
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

      // SDK 초기화 보장 (네트워크 지연 등으로 초기 마운트 시점에 실패한 경우 대비)
      await initKakaoSDK();

      // 카카오 로그인 실행
      const authResponse = await loginWithKakao();
      // 백엔드에 accessToken 전달하여 세션 생성
      const loginResponse = await loginWithOAuth(
        "KAKAO",
        authResponse.access_token
      );
      console.log("백엔드 로그인 응답:", loginResponse);

      // 서버 세션 생성 확인
      const hasValidSession = await checkServerSession();
      if (!hasValidSession) {
        throw new Error("Failed to create server session");
      }

      // 카카오 사용자 정보 저장(선택)
      // 사용자 정보는 /users/me로 필요 시 별도 조회하여 사용
      setUser(null);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      // 로그인 실패 시 상태 정리
      setUser(null);
      setIsAuthenticated(false);

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

      // 서버 세션 만료
      try {
        await apiLogout();
      } catch (err) {
        // 이미 만료(401) 등은 무시
        console.debug("Server logout ignored:", err);
      }

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

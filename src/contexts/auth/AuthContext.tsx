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
import { loginWithOAuth, getUserProfile } from "../../libs/api";

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
      await initializeKakao();

      // 서버 세션 상태 확인
      const hasValidSession = await checkServerSession();
      
      if (hasValidSession) {
        // 로컬에 저장된 사용자 정보 확인
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
          const userProfile = JSON.parse(savedUserInfo);
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } else {
        // 서버 세션이 없으면 로컬 데이터도 정리
        removeKakaoToken();
        removeUserInfo();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      removeKakaoToken();
      removeUserInfo();
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

      // 카카오 로그인 실행
      const authResponse = await loginWithKakao();
      console.log("카카오 로그인 성공:", authResponse);

      // 백엔드로 카카오 액세스 토큰 전송하여 세션 생성
      const loginResponse = await loginWithOAuth(
        "KAKAO",
        authResponse.access_token
      );
      console.log("백엔드 로그인 응답:", loginResponse);

      // 쿠키 확인 (디버깅용)
      console.log("=== 쿠키 상태 확인 ===");
      console.log("현재 쿠키:", document.cookie);
      console.log("쿠키 길이:", document.cookie.length);
      
      // 모든 쿠키 확인
      const cookies = document.cookie.split(';');
      console.log("분리된 쿠키들:", cookies);
      
      // JSESSIONID 쿠키 찾기
      const jsessionCookie = cookies.find(cookie => 
        cookie.trim().startsWith('JSESSIONID=')
      );
      console.log("JSESSIONID 쿠키:", jsessionCookie);
      
      // 브라우저 Application 탭에서 확인할 수 있는 정보
      console.log("=== 브라우저 Application 탭 확인 ===");
      console.log("1. F12 → Application → Cookies → api.s-baro.shop");
      console.log("2. JSESSIONID 쿠키가 저장되어 있는지 확인");
      console.log("3. 쿠키 속성 (Domain, Path, Secure, HttpOnly, SameSite) 확인");

      // 서버 세션 생성 확인
      console.log("=== 서버 세션 확인 시작 ===");
      const hasValidSession = await checkServerSession();
      console.log("서버 세션 확인 결과:", hasValidSession);
      
      if (!hasValidSession) {
        console.error("서버 세션 생성 실패 - 쿠키가 저장되지 않았을 가능성");
        throw new Error("Failed to create server session");
      }

      // 카카오에서 사용자 정보 가져오기
      const kakaoUser = await getKakaoUserInfo();

      // 상태 업데이트
      setUser(kakaoUser);
      setIsAuthenticated(true);
      saveUserInfo(kakaoUser);

      console.log("Login successful, isNew:", loginResponse.isNew);
    } catch (error) {
      console.error("Login failed:", error);
      // 로그인 실패 시 상태 정리
      setUser(null);
      setIsAuthenticated(false);
      removeKakaoToken();
      removeUserInfo();
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

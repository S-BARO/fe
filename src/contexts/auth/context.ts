import { createContext } from "react";
import type { KakaoUser } from "../../types/kakao";

export interface AuthContextType {
  user: KakaoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

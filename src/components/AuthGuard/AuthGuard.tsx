import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 로딩 중이면 로딩 UI 표시
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        로딩 중...
      </div>
    );
  }

  // 인증되지 않았으면 fallback UI 표시 (기본값: null)
  if (!isAuthenticated) {
    return fallback || null;
  }

  // 인증되었으면 자식 컴포넌트 렌더링
  return <>{children}</>;
}

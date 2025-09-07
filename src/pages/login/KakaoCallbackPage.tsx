import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithOAuthCode } from "../../libs/api";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    const run = async () => {
      try {
        if (!code) throw new Error("No authorization code");
        const redirectUri = `${location.origin}/login/kakao/callback`;
        await loginWithOAuthCode("KAKAO", code, redirectUri);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Kakao callback error:", err);
        navigate("/login", { replace: true });
      }
    };

    void run();
  }, [location.search, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      카카오 로그인 처리 중...
    </div>
  );
}

export default KakaoCallbackPage;

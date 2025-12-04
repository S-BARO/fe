import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithOAuth } from "../../libs/api";
import { useAuth } from "../../contexts/auth";
import { initKakaoSDK } from "../../libs/kakaoAuth";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initializeAuth } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        // 카카오 SDK 초기화
        await initKakaoSDK();

        // URL에서 authorizationCode 가져오기
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        
        if (!code) {
          throw new Error("No authorization code");
        }

        // 카카오 SDK에서 accessToken 가져오기 시도
        // v2 SDK의 authorize를 사용한 경우, SDK가 자동으로 토큰을 설정할 수 있음
        let accessToken = window.Kakao?.Auth?.getAccessToken();
        
        if (!accessToken) {
          // accessToken이 없으면 authorizationCode를 accessToken으로 교환
          // 카카오 토큰 API 호출 (CORS 문제가 발생할 수 있으므로 백엔드 프록시 권장)
          const redirectUri = `${window.location.origin}/login/kakao/callback`;
          
          const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: "7d021d3904622b1a17c327477770ba58",
              redirect_uri: redirectUri,
              code: code,
            }),
          });

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("Kakao token exchange failed:", errorText);
            throw new Error("Failed to exchange authorization code for access token");
          }

          const tokenData = await tokenResponse.json();
          accessToken = tokenData.access_token;
        }

        if (!accessToken) {
          throw new Error("Failed to get access token");
        }

        // 백엔드에 accessToken 전송 (요청 형식: { provider: "KAKAO", accessToken: "..." })
        await loginWithOAuth("KAKAO", accessToken);
        await initializeAuth();
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Kakao callback error:", err);
        navigate("/login", { replace: true });
      }
    };

    void run();
  }, [location.search, navigate, initializeAuth]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      카카오 로그인 처리 중...
    </div>
  );
}

export default KakaoCallbackPage;

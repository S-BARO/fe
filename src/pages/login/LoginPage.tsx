import styled from "@emotion/styled";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: white;
`;

const LoginCard = styled.div`
  text-align: center;
  width: 100%;
  min-width: 320px;
`;

const KakaoLoginButton = styled.button`
  background: #fee500;
  color: #000000;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3);
  -webkit-tap-highlight-color: transparent; /* 모바일 터치 하이라이트 제거 */
  touch-action: manipulation; /* 터치 최적화 */

  &:hover {
    background: #fdd835;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(254, 229, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
    background: #fdd835;
  }

  /* 모바일에서 호버 효과 비활성화 */
  @media (hover: none) {
    &:hover {
      background: #fee500;
      transform: none;
      box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3);
    }
  }
`;

const KakaoIcon = styled.div`
  width: 20px;
  height: 20px;
  background: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #fee500;
`;

const LoginTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const LoginSubtitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
`;

function LoginPage() {
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨");
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Login</LoginTitle>
        <LoginSubtitle>로그인이 필요합니다.</LoginSubtitle>
        <KakaoLoginButton onClick={handleKakaoLogin}>
          <KakaoIcon>K</KakaoIcon>
          카카오로 시작하기
        </KakaoLoginButton>
      </LoginCard>
    </LoginContainer>
  );
}

export default LoginPage;

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUserProfile } from "../../libs/api";
import styled from "@emotion/styled";

const MyPageContainer = styled.div`
  padding: 20px 16px;
  background: #fff;
  min-height: 100vh;
`;

const ProfileSection = styled.div`
  margin-bottom: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 32px;
  color: #6b7280;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: #e5e7eb;
  color: #374151;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const InfoSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #ef4444;
  text-align: center;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

function MyPage() {
  const navigate = useNavigate();
  
  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  // 에러 처리 - 401 에러 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (error) {
      const status = (error as any)?.status ?? (error as any)?.response?.status;
      if (status === 401) {
        navigate("/login");
      }
    }
  }, [error, navigate]);

  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log("로그아웃");
  };

  if (isLoading) {
    return (
      <MyPageContainer>
        <LoadingContainer>프로필 정보를 불러오는 중...</LoadingContainer>
      </MyPageContainer>
    );
  }

  if (error) {
    // 에러가 있지만 401이 아닌 경우 (네트워크 에러 등)
    const status = (error as any)?.status ?? (error as any)?.response?.status;
    if (status !== 401) {
      return (
        <MyPageContainer>
          <ErrorContainer>
            <div>프로필 정보를 불러오는데 실패했습니다.</div>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>
              잠시 후 다시 시도해주세요.
            </div>
          </ErrorContainer>
        </MyPageContainer>
      );
    }
    // 401 에러인 경우 로딩 상태를 유지 (리다이렉트 중)
    return (
      <MyPageContainer>
        <LoadingContainer>로그인 페이지로 이동 중...</LoadingContainer>
      </MyPageContainer>
    );
  }

  if (!userProfile) {
    return (
      <MyPageContainer>
        <ErrorContainer>
          <div>사용자 정보를 찾을 수 없습니다.</div>
        </ErrorContainer>
      </MyPageContainer>
    );
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "BUYER":
        return "구매자";
      case "SELLER":
        return "판매자";
      case "ADMIN":
        return "관리자";
      default:
        return role;
    }
  };

  return (
    <MyPageContainer>
      <ProfileSection>
        <ProfileHeader>
          <ProfileImage>
            {userProfile.name.charAt(0)}
          </ProfileImage>
          <ProfileInfo>
            <UserName>{userProfile.name}</UserName>
            <UserEmail>{userProfile.email}</UserEmail>
            <UserRole>{getRoleText(userProfile.role)}</UserRole>
          </ProfileInfo>
        </ProfileHeader>
      </ProfileSection>

      <InfoSection>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoItem>
          <InfoLabel>이름</InfoLabel>
          <InfoValue>{userProfile.name}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>이메일</InfoLabel>
          <InfoValue>{userProfile.email}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>전화번호</InfoLabel>
          <InfoValue>{userProfile.phoneNumber}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>주소</InfoLabel>
          <InfoValue>{userProfile.address}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>회원 유형</InfoLabel>
          <InfoValue>{getRoleText(userProfile.role)}</InfoValue>
        </InfoItem>
      </InfoSection>

      <LogoutButton onClick={handleLogout}>
        로그아웃
      </LogoutButton>
    </MyPageContainer>
  );
}

export default MyPage;

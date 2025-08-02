import { useNavigate, useLocation } from "react-router";
import CategoryTabIcon from "../icons/CategoryTabIcon";
import HomeTabIcon from "../icons/HomeTabIcon";
import LikeTabIcon from "../icons/LikeTabIcon";
import MypageTabIcon from "../icons/MypageTabIcon";
import SwapTabIcon from "../icons/SwapTabIcon";
import { GNBWrapper, IconButton } from "./styles";

function GNB() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 active 상태를 결정
  const isHome = location.pathname === "/";
  const isSwap = location.pathname.startsWith("/swap");
  // 아래는 예시, 실제 경로에 맞게 수정 필요
  const isCategory = location.pathname.startsWith("/category");
  const isLike = location.pathname.startsWith("/like");
  const isMypage = location.pathname.startsWith("/mypage");

  return (
    <GNBWrapper>
      <IconButton onClick={() => navigate("/category")}>
        <CategoryTabIcon active={isCategory} />
      </IconButton>
      <IconButton onClick={() => navigate("/swap")}>
        <SwapTabIcon active={isSwap} />
      </IconButton>
      <IconButton onClick={() => navigate("/")}>
        <HomeTabIcon active={isHome} />
      </IconButton>
      <IconButton onClick={() => navigate("/like")}>
        <LikeTabIcon active={isLike} />
      </IconButton>
      <IconButton onClick={() => navigate("/mypage")}>
        <MypageTabIcon active={isMypage} />
      </IconButton>
    </GNBWrapper>
  );
}

export default GNB;

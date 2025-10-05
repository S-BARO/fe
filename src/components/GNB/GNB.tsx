import { useNavigate, useLocation } from "react-router";
import HomeTabIcon from "../icons/HomeTabIcon";
import LikeTabIcon from "../icons/LikeTabIcon";
import MypageTabIcon from "../icons/MypageTabIcon";
import SwapTabIcon from "../icons/SwapTabIcon";
import CartTabIcon from "../icons/CartTabIcon";
import { GNBWrapper, IconButton } from "./styles";
import styled from "@emotion/styled";

const TabLabel = styled.span<{ active: boolean }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ active }) => (active ? "#111" : "#9CA3AF")};
  line-height: 1.2;
  text-align: center;
`;

function GNB() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 active 상태를 결정
  const isHome = location.pathname === "/";
  const isSwap = location.pathname.startsWith("/swap");
  const isLike = location.pathname.startsWith("/baro-fitting");
  const isCart = location.pathname.startsWith("/cart");
  const isMypage = location.pathname.startsWith("/my");

  return (
    <GNBWrapper>
      <IconButton onClick={() => navigate("/baro-fitting")}>
        <LikeTabIcon active={isLike} />
        <TabLabel active={isLike}>바로핏팅</TabLabel>
      </IconButton>
      <IconButton onClick={() => navigate("/swap")}>
        <SwapTabIcon active={isSwap} />
        <TabLabel active={isSwap}>스왑</TabLabel>
      </IconButton>
      <IconButton onClick={() => navigate("/")}>
        <HomeTabIcon active={isHome} />
        <TabLabel active={isHome}>홈</TabLabel>
      </IconButton>
      <IconButton onClick={() => navigate("/cart")}>
        <CartTabIcon active={isCart} />
        <TabLabel active={isCart}>장바구니</TabLabel>
      </IconButton>
      <IconButton onClick={() => navigate("/my")}>
        <MypageTabIcon active={isMypage} />
        <TabLabel active={isMypage}>마이</TabLabel>
      </IconButton>
    </GNBWrapper>
  );
}

export default GNB;

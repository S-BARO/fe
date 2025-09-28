import { useNavigate, useLocation } from "react-router";
import HomeTabIcon from "../icons/HomeTabIcon";
import LikeTabIcon from "../icons/LikeTabIcon";
import MypageTabIcon from "../icons/MypageTabIcon";
import SwapTabIcon from "../icons/SwapTabIcon";
import CartTabIcon from "../icons/CartTabIcon";
import { GNBWrapper, IconButton } from "./styles";

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
      </IconButton>
      <IconButton onClick={() => navigate("/swap")}>
        <SwapTabIcon active={isSwap} />
      </IconButton>
      <IconButton onClick={() => navigate("/")}>
        <HomeTabIcon active={isHome} />
      </IconButton>
      <IconButton onClick={() => navigate("/cart")}>
        <CartTabIcon active={isCart} />
      </IconButton>
      <IconButton onClick={() => navigate("/my")}>
        <MypageTabIcon active={isMypage} />
      </IconButton>
    </GNBWrapper>
  );
}

export default GNB;
